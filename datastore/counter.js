const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {   //turns a number into 5 digits stringified number: 13 => '00013'
  return sprintf('%05d', num);
};

const readCounter = (callback) => { //readCounter func takes a cb as argument and runs readFile method which reads the counterFile
  fs.readFile(exports.counterFile, (err, fileData) => {  //counterfile will later be exported into a txt file in the hard drive??
    console.log('readCOunter callback', callback);
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const cb = function(arg1, arg2) {
  console.log('arg2', arg2);
  return arg2;
};


const writeCounter = (count, callback) => {
  console.log('wc', callback);
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  // counter = counter + 1;
  // return zeroPaddedNumber(counter);
  readCounter((err, fileData) => {
    if (err) {
      throw err;
    } else {
      writeCounter(fileData + 1, callback);
    }
  });

};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
