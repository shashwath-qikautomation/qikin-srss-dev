module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      purchaseNumber: String,
      description: String,
      status: {
        type: Number,
        default: 0,
      },
      items: [
        {
          partNumber: String,
          quantity: Number,
        },
      ],
    },
    { timestamps: true, strict: false }
  );

  const purchase = mongoose.model("purchases", schema);
  return purchase;
};
