const passport = require('passport');
const db = require("../models");
const User = db.User;
const List = db.List;

exports.register = function(req, res) {
  // Clean
  const email = req.body.email?.trim().toLowerCase();
  const username = req.body.username?.trim().toLowerCase();
  const password = req.body.password?.trim();
  const fullName = req.body.fullName?.trim();
  const nickname = req.body.nickname?.trim();

  if (
    !email    || 
    !username ||
    !password ||
    !fullName ||
    !nickname
  ) {
    return res.status(400).send({ 
      message: "A required field is missing", 
      code: 'missingField'
    });
  }

  //@todo check if email is valid
  //@todo check if username is valid
  //@todo check if username is valid
  // Express Validator https://flaviocopes.com/express-validate-input/

  User
    .find({ 
      $or: [
        { email: email },
        { username: username }
      ]
    })
    .then(users => {
      if (users.length > 0) {
        if (users[0].email === email) {
          return res.status(409).send({
            message: "Email address already registered",
            code: 'emailUnavailable'
          });
        }
        else {
          return res.status(409).send({
            message: "Username already taken",
            code: 'usernameUnavailable'
          });
        }
      }
      else { // Save user if it does not exist yet
        var newUser = new User();
        newUser.email = email;
        newUser.username = username;
        newUser.fullName = fullName;
        newUser.nickname = nickname;
        newUser.setPassword(password);
        newUser
          .save()
          .then(() => {
            var token = newUser.generateJwt();
            res.status(200).json({ "token": token });
          })
          .catch(err => {
            res.status(500).send({
                message: "Some error occured while creating the user",
                error: err
            });
          });
      }
    });
};

exports.login = function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    // If Passport throws/catches an error
    if (err) {
      return res.status(404).send(err);
    }

    // If a user is found
    if (user) {
      res.status(200);
      res.json({ "token": user.generateJwt() });
    } 
    else { 
      res.status(401).json(info); 
    }
  })(req, res);

};

exports.getUserDetails = function(req,res) {
  const id = req.params.id;
  if (req.user.id !== id) return res.status(401).send({ message: "Unauthorized error" });

  User
    .findById(id, {hash: 0, salt: 0})
    .populate('preferences.defaultList', ['id', 'name'])
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "User with id " + id + " not found"});
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({ 
        message: "Error retrieving user with id " + id,
        error: err
      });
    });
};

exports.delete = function(req, res) {
  const id = req.params.id;
  const password = req.body.password;  

  if (req.user.id !== id) return res.status(401).send({ message: "Unauthorized error" });

  // Require password
  if (!password) {
    res.status(400).send({ message: 'Password is required' });
  }

  // Find user
  User
    .findById(id)
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "User with id " + id + "not found"});
      } else {
        if (!user.validPassword(password)) {
          res.status(401).send({message:" Password is incorrect", code: "pass"});
        } else {
          // If password is valid, delete user
          User
            .deleteOne({ _id: db.mongoose.Types.ObjectId(id) })
            .then(data => {
              if (!data) {
                res.status(404).send({ message: `Cannot delete User with id ${id}. User was not found!` });
              } else {
                res.send({ message: "User was deleted successfully!" });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Error deleting User with id " + id,
                error: err
              });
            }); 
        }
      }
    })
    .catch(err => {
      res.status(500).send({ 
        message: "Error retrieving User with id " + id,
        error: err
      });
    });
}

exports.update = (req, res) => {
  const id = req.params.id;
  if (req.user.id !== id) return res.status(401).send({ message: "Unauthorized error" });

  if (!req.body) {
    return res.status(400).send({ message: 'Data to update cannot be empty' });
  }

  // Clean data
  const fullName = req.body.fullName?.trim();
  const nickname = req.body.nickname?.trim();

  // Check if any required field is missing
  if (!fullName || !nickname) {
    return res.status(400).send({ 
      message: "A required field is missing", 
      code: 'missingField'
    });
  }

  const newData = {
    fullName: fullName,
    nickname: nickname
  }

  User
    .findByIdAndUpdate(id, newData)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot update User with id ${id}. User was not found!`});
      } else {
        res.send({ message: "User was updated successfully" });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id " + id,
        error: err.name 
      });
    });
};
