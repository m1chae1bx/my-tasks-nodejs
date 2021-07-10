module.exports = app => {
  const lists = require("../controllers/list.controller.js");
  const jwt = require('express-jwt');
  const auth = jwt({
    secret: 'MY_SECRET', // @todo to be set as environment variable instead of hardcoded
    userProperty: 'payload',
    algorithms: ['HS256'] 
  });

  var router = require("express").Router();

  // Create a new List
  router.post("/", auth, lists.create);

  // // Retrieve all Tasks
  // router.get("/", auth, tasks.find);
  
  // // Retrieve a single Task with ID
  // router.get("/:id", auth, tasks.findOne);

  // // Update a Task with ID
  // router.put("/:id", auth, tasks.update);

  // // Delete a Task with ID
  // router.delete("/:id", auth, tasks.delete);

  app.use('/api/lists', router);
}