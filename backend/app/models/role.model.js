module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      name: {
        type: String,
        require: [true, "Role name is required"],
      },
      description: {
        type: String,
      },
      designation: {
        type: String,
      },
    },
    { timestamps: true, strict: false }
  );

  const Role = mongoose.model("roles", schema);
  return Role;
};
