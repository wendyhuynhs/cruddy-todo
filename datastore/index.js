const path = require('path');
const _ = require('underscore');
const counter = require('./counter.js');
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'));

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text) => {
  // counter.getNextUniqueId((err, id) => {
  //   if (err) {
  //     callback(err)
  //   } else {
  //     const filePath = path.join(exports.dataDir, `${id}.txt`)
  //     fs.writeFile(filePath, text, (err) => {
  //       if (err) {
  //         callback(err);
  //       } else {
  //         callback(null, { id, text })
  //       }
  //     })
  //   }
  // });
  return counter.getNextUniqueId()
    .then(id => {
      const filePath = path.join(exports.dataDir, `${id}.txt`)
      return fs.writeFileAsync(filePath, text)
    })
    .then((id) => { id, text })
    .catch(err => console.error(err))
};


exports.readAll = () => {
  // fs.readdir(exports.dataDir, 'utf8', (err, files) => {
  //   if (err) {
  //     callback(err);
  //   } else {
  //     return files.map((file) => {
  //       const filePath = path.join(exports.dataDir, file)
  //       fs.readFile(filePath, 'utf8', (err, data) => {
  //         // console.log(filePath);
  //         // console.log(file);  
  //         if (err) {
  //           callback(err);
  //         } else {
  //           return { id: file, text: data.toString() }
  //         }
  //       })
  //     })
  //   }
  // })
  return fs.readdirAsync(exports.dataDir, 'utf8')
    .then(files => {
      return files.map(file => {
        file = file.substring(0,5)
        return exports.readOne(file)
        .then(data => data)
        .catch(err => console.error(err))
      })
    })
    .then(data => Promise.all(data))
    .catch(err => console.error(err))
};

exports.readOne = (id, callback) => {
  // const filePath = path.join(exports.dataDir, `${id}.txt`)
  // fs.readFile(filePath, (err, data) => {
  //   if (err) {
  //     callback(err)
  //   } else {
  //     callback(null, { id, text: data.toString() })
  //   }
  // })
  const filePath = path.join(exports.dataDir, `${id}.txt`)
  return fs.readFileAsync(filePath)
    .then(text => {
      return {id, text: text.toString()}
    })
    .catch(err => console.error(err))
};

exports.update = (id, text, callback) => {
  // const filePath = path.join(exports.dataDir, `${id}.txt`)
  // fs.readFile(filePath, (err, data) => {
  //   if (err) {
  //     callback(err)
  //   } else {
  //     fs.writeFile(filePath, text, (err, data) => {
  //       if (err) {
  //         callback(err)
  //       } else {
  //         callback(null, { id, text })
  //       }
  //     })
  //   }
  // })
  const filePath = path.join(exports.dataDir, `${id}.txt`)
  return fs.readFileAsync(filePath)
    .then(data => {
      return fs.writeFileAsync(filePath, text)
        .catch(err => console.error(err))
    })
    .catch(err => console.error(err))    
};

exports.delete = (id, callback) => {
  // const filePath = path.join(exports.dataDir, `${id}.txt`)  
  // fs.readFile(filePath, (err, data) => {
  //   if (err) {
  //     callback(err);
  //   } else {
  //     fs.unlink(filePath, (err, data) => {
  //       if (err) {
  //         callback(err);
  //       } else {
  //         callback();
  //       }
  //     })
  //   }
  // })
  const filePath = path.join(exports.dataDir, `${id}.txt`) 
  return fs.readFileAsync(filePath)
    .then(() => {
      return fs.unlink(filePath)
        .catch(err =>console.error(err))
    })
    .catch(err =>console.error(err))    
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
