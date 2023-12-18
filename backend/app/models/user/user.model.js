module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      firstName: {
        type: String,
        required: [true, "First name is required"],
      },

      userId: {
        type: String,
        unique: [true, "The userId already used"],
      },
      pin: String,
      lastName: String,
      phoneNumber: {
        type: Number,
        unique: [true, "The phone number is already exist"],
        required: [true, "Phone number is required"],
        validate: {
          validator: function (num) {
            return num.toString().length >= 10;
          },
          message: (props) => `${props.value} phone number must have 10 digits`,
        },
      },
      emailId: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        validate: {
          validator: function (id) {
            return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(id);
          },
          message: (props) => `${props.value} please enter a valid email`,
        },
      },

      role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roles",
      },
    },
    { timestamps: true, strict: true }
  );

  const User = mongoose.model("user", schema);
  return User;
};
