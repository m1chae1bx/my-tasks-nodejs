module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
          name: { type: String },
          completed: { type: Boolean, default: false },
          dueDate: { type: Date, default: null },
          desc: { type: String, default: null }
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

    mongoose.set('useCreateIndex', true);

    const Task = mongoose.model("task", schema);
    return Task;
  };