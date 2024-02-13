"use strict";

const Bucket = require("../Models/bucketModel");

const createBucket = function (bucketData, callback) {
  new Bucket(bucketData).save(callback);
};

const getBucket = function (criteria, callback) {
  Bucket.count(criteria, callback);
};

const deleteBucket = function (criteria, callback) {
  Bucket.deleteOne(criteria, callback);
};

const updateBucket = function (criteria, dataToSet, options, callback) {
  Bucket.findOneAndUpdate(criteria, dataToSet, options, callback);
};

const listBuckets = function (criteria, projection, options, callback) {
  Bucket.find(criteria, projection, options, callback);
};

module.exports = {
  createBucket,
  getBucket,
  deleteBucket,
  updateBucket,
  listBuckets,
};
