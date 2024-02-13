// s3Controller.js

"use strict";
const async = require("async");
const bucketService = require("../Services/bucketService");
const objectService = require("../Services/objectService");

const createBucket = (req, res) => {
  const BucketData = req.body;
  async.auto(
    {
      // Validate if bucket name is provided
      validateBucketName: (callback) => {
        if (!BucketData.bucketName) {
          return callback("Bucket name is required");
        }
        callback();
      },
      // Check if the bucket exists
      checkBucketExists: [
        "validateBucketName",
        (res, callback) => {
          bucketService.getBucket(
            { name: BucketData.bucketName },
            (err, bucket) => {
              if (err) {
                return callback(err);
              }
              if (bucket) {
                return callback(
                  "Bucket Name already exist. Try some other name"
                );
              }
              callback();
            }
          );
        },
      ],
      // Create the Bucket
      createBucket: [
        "checkBucketExists",
        (results, callback) => {
          let name = BucketData.bucketName.split(" ").join("-");

          bucketService.createBucket({ name }, (err, result) => {
            if (err) {
              return callback(err);
            }
            callback(null, result);
          });
        },
      ],
    },
    (err, results) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.json({
        message: "Bucket created successfully",
        result: results.createBucket,
      });
    }
  );
};

const listBuckets = (req, res) => {
  // console.log("REQ PARAM GET==>", req.params);
  try {
    bucketService.listBuckets({}, {}, { lean: true }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// const deleteBucket = (req, res) => {
//   let criteria = {
//     name: req.params.name,
//   };
//   try {
//     bucket.deleteBucket(criteria, (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: "Internal server error" });
//       }
//       res.json({ message: "Bucket deleted successfully" });
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const deleteBucket = (req, res) => {
  let criteria = {
    name: req.params.name,
  };
  async.auto(
    {
      checkIfBucketExist: (callback) => {
        bucketService.getBucket(criteria, (err, count) => {
          if (err) {
            return callback(err);
          }
          if (count === 0) {
            return callback("Bucket does not exist");
          }
          callback();
        });
      },
      deleteAllFilesInBucket: [
        "checkIfBucketExist",
        (res, callback) => {
          objectService.deleteAllObject(
            { bucket: req.params.name },
            (err, result) => {
              if (err) {
                return callback(err);
              }
              callback();
            }
          );
        },
      ],
      deleteBucket: [
        "deleteAllFilesInBucket",
        (res, callback) => {
          bucketService.deleteBucket(criteria, (err, result) => {
            if (err) {
              return callback("Err in deleting bucket", err);
            }
            callback(null, "Delete successfully");
          });
        },
      ],
    },
    (err, results) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.json({
        message: "Object Delete successfully",
      });
    }
  );
};

module.exports = {
  createBucket,
  listBuckets,
  deleteBucket,
};
