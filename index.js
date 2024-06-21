const express = require("express");
const bodyParser = require("body-parser");
const s3Routes = require("./Routes/s3Routes");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3000;

// Multer configuration
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.any());

// MongoDB connection string
const mongoUri = "mongodb://localhost:27017/readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

// Establish MongoDB Connection
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected on 27017"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process with failure
  });

app.use("/", s3Routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





















// const express = require("express");
// const bodyParser = require("body-parser");
// const s3Routes = require("./Routes/s3Routes");
// const mongoose = require("mongoose");
// const app = express();
// const multer = require("multer");
// // const router = express.Router();
// const port = process.env.PORT || 3000;
// // Multer configuration
// const upload = multer();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(upload.any());

// mongoose
//   .connect(
//     "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log("mongodb running on 27017"))
//   .catch((err) => console.log(err));

// app.use("/", s3Routes);

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

//   // Establish MongoDB Connection
//   const uri =
//     "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
//   const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   // Connect to MongoDB
//   client.connect((err) => {
//     if (err) {
//       console.error("Error connecting to MongoDB Atlas:", err);
//       return;
//     }

//     console.log("Connected to MongoDB Atlas");
//   });
