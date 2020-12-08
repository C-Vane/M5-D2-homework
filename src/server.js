const express = require("express");
const cors = require("cors");
/// services inport and server use services
const students = require("./services/students");
const server = express();
server.use(cors());
server.use(express.json());
server.use("/students", students);
const port = 3001;
server.listen(port, () => {
  console.log("Server running on post " + port);
});
