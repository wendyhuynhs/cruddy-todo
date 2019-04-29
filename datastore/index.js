const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter.js');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  const filePath = path.join(exports.dataDir, `${id}.txt`)
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err)
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text} )
        }
      })
    }
  });
};


exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, 'utf8', (err, files) => {
    if (err) {
      callback(err);
    } else {
      let dataArr = [];
      files.map(filePath => {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            callback(err);
          } else {
            dataArr.push(data);
          }
        })
      })
    }
  })


  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
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
