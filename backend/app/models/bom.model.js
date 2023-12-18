module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      productName: {
        type: String,
      },
      productItems: {
        type: Array,
      },
      createdAt: Date,
      updatedAt: Date,
    },
    { timestamps: true, strict: false }
  );

  const Bom = mongoose.model("boms", schema);
  return Bom;
};
