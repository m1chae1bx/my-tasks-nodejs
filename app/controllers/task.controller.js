const { response } = require("express");
const db = require("../models");
const Task = db.tasks;

// Create and Save a new Task
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({ message: "Content can not be empty"});
        return;
    }

    // Create a Task
    const task = new Task({
        name: req.body.name
    });

    task
        .save(task)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occured while creating the Task"
            });
        });
};

// Retrieve all Tasks from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    const completed = req.query.completed;
    var condition = {};
    if (name) condition = {name: { $regex: new RegExp(name), $options: "i"}};
    if (completed != null) condition = {...condition, completed: completed}

    Task.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: 
                    err.message || "Some error occurred while retrieving tasks."
            });
        });
};

// Find a single Task with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Task.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Task with id " + id });
            else
                res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Task with id " + id });
        });
};

// Update a Task by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
      return res.status(400).send({
          message: "Data to update cannot be empty!"
      });
  }

  const id = req.params.id;

  Task.findByIdAndUpdate(id, req.body, {useFindAndModify: false })
    .then(data => {
        if (!data) {
            res.status(404).send({
                message: `Cannot update Task with id ${id}. Maybe Task was not found!`
            });
        } else res.send({ message: "Task was updated successfully." });
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Task with id " + id
        });
    });
};

// Delete a Task with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Task.findByIdAndRemove(id)
    .then(data => {
        if (!data) {
            res.status(404).send({
                message: `Cannot update Task with id ${id}. Maybe Task was not found!`
            });
        } else {
            res.send({
                message: "Task was deleted successfully!"
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error deleting Task with id " + id
        });
    }); 
};

// Delete all Tasks from the database.
exports.deleteAll = (req, res) => {
  Task.deleteMany({})
    .then(data => {
        res.send({
            message: `${data.deletedCount} Tasks were deleted successfully!`
        });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while removing all tasks."
        });
    });
};