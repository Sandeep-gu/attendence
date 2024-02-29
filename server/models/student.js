const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    attendence: [
      {
        date: {
          type: Date,
          required: true,
        },
        signIn: {
          type: Date,
        },
        signOut: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

const studentModels = mongoose.model("student", studentSchema);
module.exports = studentModels;
