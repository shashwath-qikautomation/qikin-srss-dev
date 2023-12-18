module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      workOrderNumber: String,
      description: String,
      status: {
        type: Number,
        default: 0,
      },
      productName: String,
      items: [
        {
          partNumber: String,
          productName: String,
          quantity: Number,
        },
      ],

      createdOn: Date,
      updatedOn: Date,
    },
    { timestamps: true, strict: false }
  );

  const workOrder = mongoose.model("workorder", schema);
  return workOrder;
};
