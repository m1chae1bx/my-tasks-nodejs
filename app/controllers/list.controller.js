const db = require("../models");
const List = db.List;

// Create and save a new task
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    return res.status(400).send({ message: "Content can not be empty" });
  }

  const list = new List({
    name: req.body.name,
    owner: req.body.owner
  });

  list
    .save()
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: "Some error occured while creating the list",
        error: err
      });
    });
};