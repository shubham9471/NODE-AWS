const express = require("express");
const bodyParser = require("body-parser");
const s3Routes = require("./Routes/s3Routes");
const mongoose = require("mongoose");
const app = express();
const multer = require("multer");
// const router = express.Router();
const port = process.env.PORT || 3000;
// Multer configuration
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.any());

mongoose
  .connect(
    "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
    { useNewUrlParser: true }
  )
  .then(() => console.log("mongodb running on 27017"))
  .catch((err) => console.log(err));

app.use("/", s3Routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
