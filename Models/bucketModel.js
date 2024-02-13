const mongoose = require("mongoose");

const bucketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  }
},{
    timestamps: true
});

module.exports = mongoose.model("Bucket", bucketSchema);
