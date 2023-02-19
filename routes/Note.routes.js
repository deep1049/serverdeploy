const express = require("express");
const { noteModel } = require("../model/Note.model");

const noteRouter = express.Router();

noteRouter.get("/", async (req, res) => {
  //const query = req.query;
  try {
    const user = await noteModel.find();
    res.send(user);
  } catch (error) {
    res.send({ msg: "Not getting anything", error: error });
  }
});

noteRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const note = new noteModel(payload);
    await note.save();
    res.send("Note Created");
  } catch (error) {
    res.send({ msg: "errr" });
  }
});

noteRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const noteID = req.params.id;
  const note = await noteModel.findOne({ _id: noteID });
  const userID_in_note = note.user;
  const userID_in_making_req = req.body.user;
  try {
    if (userID_in_making_req !== userID_in_note) {
      res.send({ msg: "You are not authorised" });
    } else {
      await noteModel.findByIdAndUpdate({ _id: noteID }, payload);

      res.send("updated");
    }
  } catch (error) {
    res.send({ msg: "errr", error });
  }
});

noteRouter.delete("/delete/:id", async (req, res) => {
  const noteID = req.params.id;
  const note = await noteModel.findOne({ _id: noteID });
  const userID_in_note = note.user;
  const userID_in_making_req = req.body.user;
  try {
    if (userID_in_making_req !== userID_in_note) {
      res.send({ msg: "You are not authorised" });
    } else {
      await noteModel.findByIdAndDelete({ _id: noteID });

      res.send("deleted");
    }
  } catch (error) {
    res.send({ msg: "errr", error });
  }
});
module.exports = { noteRouter };
