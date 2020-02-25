const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  var allTodos = [];

  fs.readdir(exports.dataDir, (err, files) => {
    var result = files.map((file) => {
      var id = file.toString().replace('.txt', '');
      console.log('file :', file, 'err :', err);

      return {id, text: id};
    });
    callback(null, result);
  });


  // var allTodos = [];
  // fs.readdir(exports.dataDir, (err, files) => {
  //   files.forEach(file => {
  //     var obj = {id: file};
  //     allTodos.push(obj);
  //   });
  // });
  // callback(null, allTodos);


  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`no item with id: ${id}`));
    } else {
      callback(null, {id, text: text});
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
          callback(null, {id, newText});
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
