"use strict";

const { sql, Query } = require("./sql");

const { Columns } = require("./columns");

function updateSet(row, columns) {
  columns = columns == null ? new Columns(Object.keys(row).map(name => ({ name }))) : columns;

  return columns.join(col => {
    const colVal = col.value(row);
    const q = sql``.appendString(col.name + " = ");
    if (typeof colVal === "object" && colVal != null && colVal instanceof Query) {
      q.appendQuery(colVal);
    } else {
      q.appendValue(colVal);
    }
    if (col.cast != null) {
      q.appendString(col.cast);
    }
    return q;
  }, ",");
}

module.exports = updateSet;
