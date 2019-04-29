const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter.js');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err)
    } else {
      const filePath = path.join(exports.dataDir, `${id}.txt`)
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text })
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
      console.log(files.map((file) => {
        const filePath = path.join(exports.dataDir, file)
        fs.readFile(filePath, 'utf8', (err, data) => {
          // console.log(filePath);
          // console.log(file);  
          if (err) {
            callback(err);
          } else {
            return { id: file, text: data.toString() }
          }
        })
      }))
    }
  })

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  const filePath = path.join(exports.dataDir, `${id}.txt`)
  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(null, { id, text: data.toString() })
    }
  })
};

exports.update = (id, text, callback) => {
  const filePath = path.join(exports.dataDir, `${id}.txt`)
  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback(err)
    } else {
      fs.writeFile(filePath, text, (err, data) => {
        if (err) {
          callback(err)
        } else {
          callback(null, { id, text })
        }
      })
    }
  })
};

exports.delete = (id, callback) => {
  const filePath = path.join(exports.dataDir, `${id}.txt`)  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(filePath, (err, data) => {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      })
    }
  })

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
