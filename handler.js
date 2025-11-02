const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { getHelloWorld } = require("./handlers/getHelloWorld.handler.js");

const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const express = require("express");
const serverless = require("serverless-http");

const app = express();

const TASKS_TABLE = process.env.TASKS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get("/", getHelloWorld)

app.get("/tasks/:taskId", async (req, res) => {
  const params = {
    TableName: TASKS_TABLE,
    Key: {
      taskId: req.params.taskId,
    },
  };

  try {
    const command = new GetCommand(params);
    const { Item } = await docClient.send(command);
    if (Item) {
      const { taskId, name } = Item;
      res.json({ taskId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find task with provided "taskId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve task" });
  }
});

app.post("/tasks", async (req, res) => {
  const { taskId, name } = req.body;
  if (typeof taskId !== "string") {
    res.status(400).json({ error: '"taskId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: TASKS_TABLE,
    Item: { taskId, name },
  };

  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    res.json({ taskId, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create task" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
