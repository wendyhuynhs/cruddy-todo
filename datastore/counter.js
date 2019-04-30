const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const sprintf = require('sprintf-js').sprintf;


// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = () => {
  // fs.readFile(exports.counterFile, (err, fileData) => {
  //   if (err) {
  //     callback(null, 0);
  //   } else {
  //     callback(null, Number(fileData));
  //   }
  // });
  return fs.readFileAsync(exports.counterFile)
    .then(fileData => Number(fileData))
    .catch(() => 0)
};

const writeCounter = (count) => {
  // var counterString = zeroPaddedNumber(count);
  // fs.writeFile(exports.counterFile, counterString, (err) => {
  //   if (err) {
  //     throw ('error writing counter');
  //   } else {
  //     callback(null, counterString);
  //   }
  // });
  var counterString = zeroPaddedNumber(count);
  return fs.writeFileAsync(exports.counterFile, counterString)
    .then(() => counterString)
    .catch(err => console.error(err))
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = () => {
  // readCounter((err, data) => {
  //   if (err) {
  //     callback(err)
  //   } else {
  //     writeCounter(data + 1, (err, data) => {
  //       if (err) {
  //         callback(err);
  //       } else {
  //         callback(null, data)
  //       }
  //     })
  //   }
  // })
  return readCounter()
    .then(id => writeCounter(id + 1))
    .catch(err => console.error(err))
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
