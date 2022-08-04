const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');

Promise.promisifyAll(fs);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw err;
    } else {
      var filePath = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          throw err;
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      console.log({id: id, text: fileData.toString()});
      callback(null, {id: id, text: fileData.toString()});
    }
  });
};

var readOneAsync = Promise.promisify(exports.readOne);

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw err;
    } else {
      var promises = files.map((file) => {
        var id = file.slice(0, 5);
        return readOneAsync(id);
      });
      Promise.all(promises).then((array) => {
        callback(null, array);
      });
    }
  });
};

exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(`No item with id: ${id}`);
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
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
