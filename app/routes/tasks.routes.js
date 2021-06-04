module.exports = app => {
    const tasks = require("../controllers/task.controller.js");
    const jwt = require('express-jwt');
    const auth = jwt({
        secret: 'MY_SECRET', // @todo to be set as environment variable instead of hardcoded
        userProperty: 'payload',
        algorithms: ['HS256'] 
    });

    var router = require("express").Router();

    // Create a new Task
    router.post("/", auth, tasks.create);

    // Retrieve all Tasks
    router.get("/", auth, tasks.find);
    
    // Retrieve a single Task with ID
    router.get("/:id", auth, tasks.findOne);

    // Update a Task with ID
    router.put("/:id", auth, tasks.update);

    // Delete a Tasks with ID
    router.delete("/:id", auth, tasks.delete);

    // Delete all Tasks
    router.delete("/", auth, tasks.deleteAll);

    app.use('/api/tasks', router);
}