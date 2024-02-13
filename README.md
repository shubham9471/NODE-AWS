# NODE-AWS

router.post("/objects/create/:bucket/:fileName", objectController.createObject);

NOTE FIRST WE NEED TO CREATE BUCKET ONLY THEN OBJECT CAN BE CREATED

However fileName can be passed here should be new. That should not already be taken

The Data will be passed through body as raw and in form of json

{
"name":"test",
"age": "10",
"address": "India",
"No": 1223333344
}

OR you can upload any file using formData

router.get("/objects/get/:bucket/:fileName", objectController.getObject);

pass existing bucketName and fileName

router.put("/objects/put/:bucket/:fileName", objectController.updateObject);

You can update data Object that we created or even the file that was uploaded
But can only update one at a time

router.delete(
"/objects/delete/:bucket/:fileName",
objectController.deleteObject
);

Simply pass the bucket and file Name

router.get("/objects/:bucket", objectController.listObjects);

just pass the bucket and it will display all the fileName and data associated with the bucket

// BUCKET
router.post("/bucket/create", bucketController.createBucket);

pass the bucket details as raw in json from body in following form

{
"bucketName":"Testing"
}

router.get("/buckets", bucketController.listBuckets);

This is used to list down all the buckets present in our account

router.delete("/bucket/:name", bucketController.deleteBucket);

Just pass the bucketName to delete

NOTE: All the objects associated with this Bucket will also be deleted.
