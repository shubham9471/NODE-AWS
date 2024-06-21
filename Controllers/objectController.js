// s3Controller.js

"use strict";
const async = require("async");
const multer = require("multer");
const { Readable } = require("stream");
const { GridFSBucket } = require("mongodb");
const { MongoClient } = require("mongodb");

const objectService = require("../Services/objectService");
const bucketService = require("../Services/bucketService");

// Create object handler
const createObject = (req, res) => {


  // Use the database instance for GridFSBucket
  const dbName = "test";
  const storage = new GridFSBucket(client.db(dbName));
  async.auto(
    {
      // Validate if bucket name is provided
      validateBucketName: (callback) => {
        if (!req.params.bucket) {
          return callback("Bucket name is required");
        }
        callback();
      },
      // Check if the bucket exists
      checkBucketExists: [
        "validateBucketName",
        (results, callback) => {
          bucketService.getBucket({ name: req.params.bucket }, (err, count) => {
            if (err) {
              return callback(err);
            }
            if (count == 0) {
              return callback("Bucket does not exist. First create the Bucket");
            }
            callback();
          });
        },
      ],
      checkFileNameExists: [
        "checkBucketExists",
        (results, callback) => {
          objectService.getObject(
            { fileName: req.params.fileName },
            {},
            { lean: true },
            (err, res) => {
              if (err) {
                return callback(err);
              }
              // console.log("RESS", res);
              if (res && res.length > 0) {
                return callback("File Name is already used");
              }
              callback();
            }
          );
        },
      ],
      // Upload file to MongoDB using GridFS if a file is uploaded
      uploadFile: [
        "checkFileNameExists",
        (results, callback) => {
          if (!req.files) {
            return callback(); // No file uploaded, proceed to the next step
          }

          const readableStream = new Readable();
          readableStream.push(req.files[0].buffer);
          readableStream.push(null);

          const uploadStream = storage.openUploadStream(
            req.files[0].originalname
          );
          readableStream.pipe(uploadStream);

          uploadStream.on("error", (error) => {
            callback(error);
          });

          uploadStream.on("finish", () => {
            callback(null, uploadStream.id);
          });
        },
      ],
      // Create the object
      createObject: [
        "uploadFile",
        (results, callback) => {
          let dataToSave = {
            bucket: req.params.bucket,
            fileName: req.params.fileName,
            data: {
              fileId: null, // fileId if file uploaded, otherwise null
              bodyObject: null, // Store object data from request body if no file uploaded
            },
          };
          if (req.files) {
            dataToSave.data.fileId = results.uploadFile;
          }
          if (!req.files) {
            dataToSave.data.bodyObject = req.body;
          }

          // console.log("DATA TO SAVE ===>", dataToSave);

          objectService.createObject(dataToSave, (err, result) => {
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
        message: "Object created successfully",
        result: results.createObject,
      });
    }
  );
};

const getObject = (req, res) => {
  console.log("REQ PARAM GET==>", req.params);
  let criteria = {
    bucket: req.params.bucket,
    fileName: req.params.fileName,
  };

  try {
    objectService.getObject(criteria, {}, { lean: true }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      // console.log("RESS", res);
      if (result && result.length === 0) {
        return res.status(404).json({
          error: "Not found. Please check the bucketName or fileName.",
        });
      }
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const listObjects = (req, res) => {
  // console.log("REQ PARAM GET==>", req.params);
  let criteria = {
    bucket: req.params.bucket,
  };

  try {
    objectService.listObjects(criteria, {}, { lean: true }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      if (result && result.length === 0) {
        return res.status(404).json({
          error: "Not found. Please check the bucketName.",
        });
      }
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateObject = (req, res) => {
  const uri =
    "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Connect to MongoDB
  client.connect((err) => {
    if (err) {
      console.error("Error connecting to MongoDB Atlas:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    console.log("Connected to MongoDB Atlas");

    //console.log("REQ PARAM UPDATE==>", req.params);
    const dbName = "test";
    const storage = new GridFSBucket(client.db(dbName));
    let dataToSave = {
      data: {
        fileId: null,
        bodyObject: null,
      },
    };
    let criteria = {
      bucket: req.params.bucket,
      fileName: req.params.fileName,
    };
    let dbData = {};

    async.auto(
      {
        getDataFromDB: (callback) => {
          objectService.getObject(
            criteria,
            { data: 1 },
            { lean: true },
            (err, result) => {
              if (err) {
                return callback("Internal server error");
              }
              if (!result || result.length === 0) {
                return callback("Object not found");
              }
              dbData = result[0];
              if (dbData.data.hasOwnProperty("bodyObject")) {
                dataToSave.data.bodyObject = dbData.data.bodyObject;
              }
              if (dbData.data.hasOwnProperty("fileId")) {
                dataToSave.data.fileId = dbData.data.fileId;
              }
              // console.log("DATA TO SAVE=========>", dataToSave);
              callback();
            }
          );
        },
        chekcForMediaFile: [
          "getDataFromDB",
          (res, callback) => {
            if (!req.files) {
              return callback();
            }
            console.log("REACHED HERE =====>");
            const readableStream = new Readable();
            readableStream.push(req.files[0].buffer);
            readableStream.push(null);

            const uploadStream = storage.openUploadStream(
              req.files[0].originalname
            );
            readableStream.pipe(uploadStream);

            uploadStream.on("error", (error) => {
              callback(error);
            });

            uploadStream.on("finish", () => {
              console.log("DATA SAVE BEFORE ID===>", dataToSave);
              dataToSave.data.fileId = uploadStream.id;
              console.log("DATA SAVE AFTER ID===>", dataToSave);
              callback(null, uploadStream.id);
            });
          },
        ],
        updateDbData: [
          "chekcForMediaFile",
          (res, callback) => {
            if (!req.files) {
              // console.log("INNNNNNNNNNN");
              dataToSave.data.bodyObject = req.body;
            }
            console.log("dataToSave---->", dataToSave);
            objectService.updateObject(
              criteria,
              dataToSave,
              { lean: true, new: true },
              (err, result) => {
                if (err) {
                  return callback(err);
                }
                // console.log("RESULT====>", result);
                callback(null, result);
              }
            );
          },
        ],
      },
      (err, results) => {
        if (err) {
          return res.status(400).json({ error: err });
        }
        res.json({
          message: "Object updated successfully",
          result: results.updateDbData,
        });
      }
    );
  });
};

const deleteObject = (req, res) => {
  let criteria = {
    bucket: req.params.bucket,
    fileName: req.params.fileName,
  };
  // =====TODO ===== CHECK IF THE FILE EVEN EXISTS OR NOT BEFORE DELETEING
  try {
    objectService.deleteObject(criteria, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({ message: "Object deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createObject,
  getObject,
  listObjects,
  updateObject,
  deleteObject,
};
