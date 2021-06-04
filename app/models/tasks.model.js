module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
          name: { type: String },
          completed: { type: Boolean, default: false },
          dueDate: { type: Date, default: null },
          desc: { type: String, default: null }
        },
        { timestamps: true }
    );

    mongoose.set('useCreateIndex', true);

    const Task = mongoose.model("task", schema);
    return Task;
  };