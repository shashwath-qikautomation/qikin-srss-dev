module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phoneNumber: {
        type: Number,
      },
      address: {
        type: String,
      },
    },
    { timestamps: true, strict: false }
  );

  const Vendor = mongoose.model("vendor", schema);
  return Vendor;
};
