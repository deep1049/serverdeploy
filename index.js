const express = require("express");
// const { userModel } = require("./model/User.model");
const { connection } = require("./db");
const { userRouter } = require("./routes/User.routes");
const { noteRouter } = require("./routes/Note.routes");
const { authenticate } = require("./middlewares/authenticate.middleware");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("HOME PAGE");
});
app.use("/users", userRouter);
app.use(authenticate);
app.use("/notes", noteRouter);

app.listen(8080, async () => {
  try {
    await connection;
    console.log("connected to db");
    console.log("server running at 8080");
  } catch (error) {
    console.log("cannot able to connect to db");
  }
});
