const { getHelloWorld } = require("./handlers/get-hello-world.handler.js");
const { getOneTask } = require("./handlers/get-one-task.handler.js");
const express = require("express");
const serverless = require("serverless-http");
const createTask = require("./handlers/create-task.handler.js");
const { getAllTasks } = require("./handlers/get-all-task.handler.js");
const updateTask = require("./handlers/update-task.handler.js");
const deleteTask = require("./handlers/delete-task.handler.js");

const app = express();

app.use(express.json());

app.get("/health", getHelloWorld);

app.get("/tasks", getAllTasks);
app.get("/tasks/:taskId", getOneTask);

app.post("/tasks", createTask);

app.put("/tasks/:taskId", updateTask);

app.delete("/tasks/:taskId", deleteTask);

// Catch-all 404 handler - place at the end
app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);