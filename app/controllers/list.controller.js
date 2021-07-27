const { User } = require("../models");
const db = require("../models");
const List = db.List;

// Create and save a new list
exports.create = async (req, res) => {
  // Validate request body
  if (!req.body) return res.status(400).send({ message: "Content cannot be empty" });
  if (!req.body.name) return res.status(400).send({ message: "Name is missing" });
  if (!req.body.owner) return res.status(400).send({ message: "Owner is missing" });

  // Check authorization
  if (req.user.id !== req.body.owner) return res.status(401).send({ message: "Unauthorized error" });

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

exports.get = (req, res) => {
  if (!req.user.id) return res.status(401).send({ message: "Unauthorized error" });

  List.find({ owner: db.mongoose.Types.ObjectId(req.user.id)})
    .then(lists => res.send(lists.map(item => new List(item))))
    .catch(err => res.status(500).send({
      message: "An error occured while retrieving the lists",
      error: err
    })); 
}