const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { getHelloWorld } = require("./handlers/getHelloWorld.handler.js");
const { getOneTask } = require("./handlers/get-one-task.handler.js");
const express = require("express");
const serverless = require("serverless-http");
const createTask = require("./handlers/create-task.handler.js");

const app = express();


app.use(express.json());

app.get("/", getHelloWorld)

app.get("/tasks/:taskId", getOneTask);

app.post("/tasks", createTask);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
