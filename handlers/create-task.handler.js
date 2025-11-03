const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const TASKS_TABLE = process.env.TASKS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const createTask = async (req, res) => {
  const { taskId, title } = req.body;
  if (typeof taskId !== "string") {
    res.status(400).json({ error: '"taskId" must be a string' });
  } else if (typeof title !== "string") {
    res.status(400).json({ error: '"title" must be a string' });
  }

  const params = {
    TableName: TASKS_TABLE,
    Item: {
      taskId,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    res.json({ taskId, title });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create task" });
  }
}

module.exports = createTask