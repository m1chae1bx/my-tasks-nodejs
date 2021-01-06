module.exports = app => {
    const tasks = require("../controllers/task.controller.js");

    var router = require("express").Router();

    // Create a new Task
    router.post("/", tasks.create);

    // Retrieve all Tasks
    router.get("/", tasks.findAll);
    
    // Retrieve a single Task with ID
    router.get("/:id", tasks.findOne);

    // Update a Task with ID
    router.put("/:id", tasks.update);

    // Delete a Tasks with ID
    router.delete("/:id", tasks.delete);

    // Delete all Tasks
    router.delete("/", tasks.deleteAll);

    app.use('/api/tasks', router);
}