const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const TASKS_TABLE = process.env.TASKS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const createTask = async (req, res) => {
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
}

module.exports = createTask