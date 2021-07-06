const db = require("../models");
const Task = db.tasks;

// Create and save a new task
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    return res.status(400).send({ message: "Content can not be empty" });
  }

  const task = new Task({
    name: req.body.name,
    dueDate: req.body.dueDate,
    desc: req.body.desc
  });

  task
    .save()
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: "Some error occured while creating the task",
        error: err
      });
    });
};

// Retrieve tasks from the database
exports.find = (req, res) => {
  const id = req.query.id
  const name = req.query.name;
  const completed = req.query.completed;
  const dueDate = req.query.dueDate;
  var date = new Date(req.query.today);
  var query = {};

  if (id) query = {_id: db.mongoose.Types.ObjectId(id)};
  if (name) query = {...query, name: { $regex: new RegExp(name), $options: "i"}};
  if (completed != null) query = { ...query, completed: JSON.parse(completed) }
  if (dueDate === 'today') {
    query = { ...query, dueDate: { $eq: date } }
  } else if (dueDate === 'tomorrow') {
    date.setDate(date.getDate() + 1);
    query = { ...query, dueDate: { $eq: date } }
  } else if (dueDate === 'upcoming') {
    date.setDate(date.getDate() + 1);
    query = { ...query, dueDate: { $gt: date } }
  } else if (dueDate === 'overdue') {
    query = { ...query, dueDate: { $lt: date } }
  } else if (dueDate === 'unplanned') {
    query = { ...query, dueDate: null }
  }

  Task
    .aggregate([
      { $match: query },
      { $addFields: 
        { 
          hasValue : { $cond: [ { $eq: [ "$dueDate", null ] }, 1, 2 ] },
        }
      },
    ])
    .sort({ hasValue: -1, dueDate: 1 })
    .then(tasks => {
      res.send(tasks.map(item => new Task(item)));
    })
    .catch(err => {
      res.status(500).send({
        message: "Some error occurred while retrieving tasks",
        error: err
      });
    });
};

// Find a single task with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Task
    .findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Not found Task with id " + id });
      } else {
        res.send(new Task(data));
      }
    })
    .catch(err => {
      res.status(500).send({ 
        message: "Error retrieving Task with id " + id,
        error: err
      });
    });
};

// Update a Task by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update cannot be empty" });
  }

  const id = req.params.id;

  Task
    .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot update Task with id ${id}. Task was not found!` });
      } else {
        res.send({ message: "Task was updated successfully" });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Task with id " + id,
        error: err
      });
    });
};

// Delete a Task with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Task
    .findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot delete Task with id ${id}. Task was not found!` });
      } else {
        res.send({ message: "Task was deleted successfully" });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error deleting Task with id " + id,
        error: err
      });
    }); 
};

/** For use with multi select */
// Delete tasks from the database
// exports.deleteAll = (req, res) => {
//   Task
//     .deleteMany({})
//     .then(data => {
//       res.send({ message: `${data.deletedCount} Tasks were deleted successfully!` });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "An error occurred while removing all tasks",
//         error: err
//       });
//     });
// };