const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const TASKS_TABLE = process.env.TASKS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({ error: '"taskId" is required' });
  }

  const params = {
    TableName: TASKS_TABLE,
    Key: { taskId },
  };

  try {
    const command = new DeleteCommand(params);
    const result = await docClient.send(command);
    res.json({
      message: "Deleted task succesfully",
      taskId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update task" });
  }
};

module.exports = deleteTask;