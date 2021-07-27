module.exports = mongoose => {
  var crypto = require('crypto');
  var jwt = require('jsonwebtoken');

  var schema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true
    },
    username: {
      type: String,
      unique: true,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    },
    hash: String,
    salt: String,
    preferences: {
      defaultList: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'List' 
      }
    }
  });

  /** Schema Methods */

  schema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  }

  schema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
  }

  schema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
      id: this.id,
      email: this.email,
      username: this.username,
      exp: parseInt(expiry.getTime() / 1000)
    }, "MY_SECRET"); // @todo: DO NOT KEEP THE SECRET IN THE CODE WHEN DEPLOYED
    /** Best practice is to store the secret as an environment variable that only the originating server knows */
  }
  const User = mongoose.model("user", schema);
  return User;
};