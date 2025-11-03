const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const TASKS_TABLE = process.env.TASKS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const getOneTask = async (req, res) => {
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
      const { taskId, title, completed, createdAt } = Item;
      res.json({ taskId, title, completed, createdAt });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find task with provided "taskId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve task" });
  }
}

module.exports = {
  getOneTask,
};