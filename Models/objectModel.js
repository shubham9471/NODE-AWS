const mongoose = require("mongoose");

const objectSchema = new mongoose.Schema(
  {
    bucket: {
      type: "String",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // Modified to handle different types of data
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Object", objectSchema);
