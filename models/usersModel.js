const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    surname: {
      type: String,
      required: true,
      lowercase: true,
    },
    otherName: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    passport: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 64,
      regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    role: {
      type: String,
      // enum: ["admin", "user", "student"],
      required: true,
      // default: "User",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(autoIncrement.plugin, {
  model: "user",
  field: "userId",
  startAt: 10001,
  incrementBy: 395,
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
