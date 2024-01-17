module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendor",
      },
      workOrderId: {
        type: String,
        ref: "workorder",
      },
      //   partNumber: {
      //     type: String,
      //     require: [true, "partName is required"],
      //   },
      vendorQuantity: [
        {
          part: Number,
          partNumber: String,
          quantity: Number,
          manufacture: String,
        },
      ],
      requiredQuantity: [
        {
          partNumber: String,
          productName: String,
          quantity: Number,
        },
      ],
    },
    { timestamps: true, strict: false }
  );

  const vendorEntity = mongoose.model("vendorEntity", schema);
  return vendorEntity;
};
