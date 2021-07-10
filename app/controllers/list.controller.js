const { User } = require("../models");
const db = require("../models");
const List = db.List;

// Create and save a new list
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) return res.status(400).send({ message: "Content cannot be empty" });
  if (!req.body.name) return res.status(400).send({ message: "Name is missing" });
  if (!req.body.owner) return res.status(400).send({ message: "Owner is missing" });

  const list = new List({
    name: req.body.name,
    owner: req.body.owner
  });

  const session = await db.mongoose.startSession();
  session.startTransaction();

  var listSaveResponse = await list
    .save({ session: session })
    .catch(err => {
      res.status(500).send({
        message: "Some error occured while creating the list",
        error: err
      });
    });

  if (listSaveResponse && req.body.isDefault === true) {
    let userUpdateResponse = await User
      .findByIdAndUpdate(req.body.owner, { preferences: { defaultList: listSaveResponse._id} }, { session: session })
      .catch(err => {
        res.status(500).send({
          message: "Some error occured while creating the default list",
          error: err
        });
      });
    if (userUpdateResponse) {
      await session.commitTransaction();
      res.send(listSaveResponse);
    } else {
      await session.abortTransaction();
    }
  } else {
    await session.abortTransaction();
  }
  
  session.endSession();
};