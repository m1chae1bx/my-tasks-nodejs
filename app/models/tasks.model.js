module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
          name: String,
        },
        { timestamps: true }
    );
    
    schema.method("toJSON", function() {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });

    const Task = mongoose.model("task", schema);
    return Task;
  };