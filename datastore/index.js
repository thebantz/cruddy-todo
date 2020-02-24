const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
// TODO: import express.js? and convert the ff crud fns into said format like items.create?

var items = {}; // we want to update this and for each time that we do -- we want to store each in the datastore folder as .txt files!

// Public API - Fix these CRUD functions ///////////////////////////////////////
exports.create = (text, callback) => { // are we supposed to do error handling in here?
  var id = counter.getNextUniqueId();
  items[id] = text;
  callback(null, { id, text });
  // call in the exports.writeCounter to create a .txt file?
  // MAYBE TODO: receive a ajax request before this fn gets called?
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
  // call the exports.readFile
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
