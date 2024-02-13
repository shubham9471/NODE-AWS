const express = require("express");
const router = express.Router();
const objectController = require("../Controllers/objectController");
const bucketController = require("../Controllers/bucketController");

// OBJECTS
router.post("/objects/create/:bucket/:fileName", objectController.createObject);
router.get("/objects/get/:bucket/:fileName", objectController.getObject);
router.put("/objects/put/:bucket/:fileName", objectController.updateObject);
router.delete(
  "/objects/delete/:bucket/:fileName",
  objectController.deleteObject
);
router.get("/objects/:bucket", objectController.listObjects);

// BUCKET
router.post("/bucket/create", bucketController.createBucket);
router.get("/buckets", bucketController.listBuckets);
router.delete("/bucket/:name", bucketController.deleteBucket);

// ASSUMING WE CANNOT UPDATE BUCKET NAME ONCE CREATED , SO NO PUT OR UPDATE FOR NOW

module.exports = router;
