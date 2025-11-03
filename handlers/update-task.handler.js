const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");

const TASKS_TABLE = process.env.TASKS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, completed } = req.body;

  if (!taskId) {
    return res.status(400).json({ error: '"taskId" is required' });
  }

  const updateExpressions = [];
  const expressionAttributeValues = {};

  if (typeof title === "string") {
    updateExpressions.push("title = :title");
    expressionAttributeValues[":title"] = title;
  }

  if (typeof completed === "boolean") {
    updateExpressions.push("completed = :completed");
    expressionAttributeValues[":completed"] = completed;
  }

  if (updateExpressions.length === 0) {
    return res
      .status(400)
      .json({ error: 'At least "title" or "completed" must be provided' });
  }

  const params = {
    TableName: TASKS_TABLE,
    Key: { taskId },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  try {
    const command = new UpdateCommand(params);
    const result = await docClient.send(command);
    res.json(result.Attributes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update task" });
  }
};

module.exports = updateTask;