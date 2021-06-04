var passport = require('passport');
const db = require("../models");
const User = db.users;

exports.register = function(req, res) {
  var newUser = new User();

  /** Clean */
  const email = req.body.email?.trim().toLowerCase();
  const username = req.body.username?.trim().toLowerCase();
  const password = req.body.password?.trim();
  const fullName = req.body.fullName?.trim();
  const nickname = req.body.nickname?.trim();

  /** Check if any required field is missing */
  if (
    !email || 
    !username ||
    !password ||
    !fullName ||
    !nickname
  ) {
    return res.status(400).send({ message: "A required field is missing", code: 'missingField'});
  }

  //@todo check if email is valid
  //@todo check if username is valid
  //@todo check if username is valid
  // Express Validator https://flaviocopes.com/express-validate-input/

  User.find({ 
    $or: [
      { email: email },
      { username: username }
    ]
  })
    .then(users => {
      if (users.length > 0) {
        // console.log(req.body.email);
        if (users[0].email === email) {
          return res.status(409).send({ message: "Email address already registered", code: 'emailUnavailable'});
        } else {
          return res.status(409).send({ message: "Username already in use", code: 'usernameUnavailable'});
        }
      } else {
        newUser.email = email;
        newUser.username = username;
        newUser.fullname = fullName;
        newUser.nickname = nickname;

        newUser.setPassword(password);
        newUser.save(function(err) {
          var token;
          token = newUser.generateJwt();
          res.status(200);
          res.json({
            "token": token
          });
        });
      }
    });
};

exports.login = function(req, res) {

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};

exports.getUserDetails = function(req,res) {
  const id = req.params.id;

  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private data"
    });
    return;
  }

  User.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "User with id " + id + " not found"});
      else
        res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving user with id " + id });
    });
};

// @todo: Implement delete user
// exports.delete = function(req, res) {
//   const id = req.params.id;
//
//   // If no user ID exists in the JWT return a 401
//   if (!req.payload._id) {
//     res.status(401).json({
//       "message" : "UnauthorizedError: private data"
//     });
//     return;
//   }
// }