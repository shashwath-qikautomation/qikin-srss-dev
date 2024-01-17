module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      part: {
        type: Number,
        require: [true, "part is required"],
      },
      partNumber: {
        type: String,
        require: [true, "partName is required"],
      },
      quantity: {
        type: Number,
        require: [true, "Quantity is required"],
      },
      partDescription: {
        type: String,
      },
      manufacture: {
        type: String,
        require: [true, "manufacture is required"],
      },
      boxNumber: Number,
      createdAt: Date,
      updatedAt: Date,
    },
    { timestamps: true, strict: false }
  );

  const Inventory = mongoose.model("inventory", schema);
  return Inventory;
};
