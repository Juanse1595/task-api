const getHelloWorld = (req, res) => {
  console.log("Hello world from serverless task-api")
  res.json({ message: "Hello world from serverless task-api" })
}

module.exports = {
  getHelloWorld
}
