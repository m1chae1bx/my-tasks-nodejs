module.exports = app => {
  const authController = require("../controllers/auth.controller.js");
  const jwt = require('express-jwt');
  const auth = jwt({
      secret: 'MY_SECRET', // @todo to be set as environment variable instead of hardcoded
      userProperty: 'payload',
      algorithms: ['HS256'] 
  });

  var router = require("express").Router();

  // Create a new account
  router.post("/auth/register", authController.register);

  // Login
  router.post("/auth/login", authController.login);

  // Get user details by ID
  router.get("/user/:id", auth, authController.getUserDetails);
  
  // Delete user by ID
  router.delete('/user/:id', auth, authController.delete);

  // Update user by ID
  router.put("/user/:id", auth, authController.update);

  app.use('/api', router);
}