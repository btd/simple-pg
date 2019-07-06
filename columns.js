"use strict";

const assert = require("assert").strict;

const forEach = require("./for-each");

const { sql } = require("./sql");

/**
 *
 * @param {Object|Array} row
 * @param {Column} col
 */
function _getValue(row, col) {
  return row[col.prop];
}

function _getRawValue(rawValue) {
  return () => rawValue;
}

function prepGetValue(getValue, col) {
  return row => getValue(row, col);
}

class Column {
  /**
   *
   * @param {{name:string, prop: null|string, value: function|null|integer|number|string}} param0
   */
  constructor({ name, prop = null, value = undefined, cast = null }) {
    assert.ok(name, "`name` prop should exists");

    this.name = name;
    this.prop = prop || name;
    this.cast = cast;

    this.value = prepGetValue(
      typeof value === "undefined"
        ? _getValue
        : typeof value === "function"
        ? value
        : _getRawValue(value),
      this
    );
  }
}

class Columns {
  /**
   *
   * @param {Array<Column|Object>} columns
   */
  constructor(columns) {
    assert.ok(Array.isArray(columns), "`columns` prop must be Array");
    assert.ok(columns.length !== 0, "`columns` should not be empty");

    this.columns = columns.map(col => {
      if (col instanceof Column) return col;
      return new Column(col);
    });
  }

  /**
   *
   * @param {function} callback
   */
  forEach(callback) {
    forEach(this.columns, callback);
  }

  join(columnCallback, separator) {
    const q = sql``;

    forEach(this.columns, (col, isLast) => {
      q.append(columnCallback(col));
      if (!isLast) {
        q.append(separator);
      }
    });

    return q;
  }
}

module.exports = { Column, Columns };
