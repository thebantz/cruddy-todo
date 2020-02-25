const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

// Public API - Fix these CRUD functions ///////////////////////////////////////
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(new Error('could not retrieve ID'));
    } else {
      var pathName = path.join(exports.dataDir, id + '.txt');
      fs.writeFile(pathName, text, (err, todo) => {
        if (err) {
          callback(new Error('could not write file'));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    var promises = [];

    files.forEach((file) => {
      promises.push(new Promise((resolve, reject) => {
        fs.readFile(path.join(exports.dataDir, file), 'utf8', (err, text) => {
          if (err) {
            reject(err);
          } else {
            resolve({id: file.replace('.txt', ''), text: text});
          }
        });
      }));
    });

    Promise.all(promises).then((values) => {
      callback(err, values);
    });
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`no item with id: ${id}`));
    } else {
      callback(null, { id, text: text });
    }
  });
};

exports.update = (id, newText, callback) => {
  var pathName = path.join(exports.dataDir, id + '.txt');
  fs.readFile(pathName, (err, oldText) => {
    if (err) {
      callback(new Error(`no item with id: ${id}`));
    } else {
      fs.writeFile(pathName, newText, (err) => {
        if (err) {
          callback(new Error('could not write file'));
        } else {
          callback(null, { id, newText });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var pathName = path.join(exports.dataDir, id + '.txt');
  fs.readFile(pathName, (err) => {
    if (err) {
      callback(new Error(`no item with id: ${id}`));
    } else {
      fs.unlink(pathName, (err) => {
        if (err) {
          throw new Error('could not delete file');
        } else {
          console.log('Successfully deleted file');
          callback();
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
