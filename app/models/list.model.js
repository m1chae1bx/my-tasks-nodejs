const mongoose = require("mongoose");

module.exports = () => {
  var schema = mongoose.Schema(
      {
        name: { type: String },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      },
      { 
        timestamps: true,
        toObject: {
          getters: true,
          transform: function (doc, ret) {
            delete ret._id;
          }
        },
        toJSON: {
          getters: true,
          transform: function (doc, ret) {
            delete ret._id;
          }
        }
      }
  );

  schema.index({ owner: 1, _id: 1 });

  return mongoose.model("List", schema);
};