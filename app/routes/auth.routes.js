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
  router.post("/register", authController.register);

  // Login
  router.post("/login", authController.login);

  // Get User Details by ID
  router.get("/user/:id", auth, authController.getUserDetails);
  
  app.use('/api', router);
}