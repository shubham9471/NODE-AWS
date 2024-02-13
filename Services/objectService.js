"use strict";

const Object = require("../Models/objectModel");

const createObject = function (objectData, callback) {
  new Object(objectData).save(callback);
};

const getObject = function (criteria, projection, options, callback) {
  Object.find(criteria, projection, options, callback);
};

const deleteObject = function (criteria, callback) {
  Object.deleteOne(criteria, callback);
};

const deleteAllObject = function (criteria, callback) {
  Object.deleteMany(criteria, callback);
};

const updateObject = function (criteria, dataToSet, options, callback) {
  Object.findOneAndUpdate(criteria, dataToSet, options, callback);
};

const listObjects = function (criteria, projection, options, callback) {
  Object.find(criteria, projection, options, callback);
};

module.exports = {
  createObject,
  getObject,
  deleteObject,
  updateObject,
  listObjects,
  deleteAllObject,
};
