const express = require("express");
const { userModel } = require("../model/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  const query = req.query;
  try {
    const user = await userModel.find(query);
    res.send(user);
  } catch (error) {
    res.send({ msg: "Not getting anything", error: error });
  }
});

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      // Store hash in your password DB.
      if (err) {
        res.send({ msg: "Something went wrong", error: err.message });
      } else {
        const user = new userModel({ name, email, password: hash });
        await user.save();
        res.send({ msg: "New user has been registered" });
      }
    });
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, async (err, result) => {
        // result == true
        if (result) {
          let token = jwt.sign({ userID: user[0]._id }, "masai");
          res.send({ msg: "Login in", token: token });
        } else {
          res.send({
            msg: " please provide correct password",
          });
        }
      });
    } else {
      res.send({ msg: "Wrong Credentials" });
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

module.exports = { userRouter };
