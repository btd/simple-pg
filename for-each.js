"use strict";

module.exports = function forEach(arr, callback) {
  const l = arr.length;
  for (let i = 0; i < l; i++) {
    callback(arr[i], i === l - 1);
  }
};
