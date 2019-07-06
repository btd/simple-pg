"use strict";
const { sql } = require("./sql");

const arr = require("arrify");

const forEach = require("./for-each");

const { Columns } = require("./columns");

const assert = require("assert").strict;

function values(rows, columns = null) {
  rows = arr(rows);
  assert(rows.length !== 0, "Empty values rows");

  columns = columns == null ? new Columns(Object.keys(rows[0]).map(name => ({ name }))) : columns;

  const q = sql``;

  forEach(rows, (row, isLast) => {
    q.appendString("(")
      .append(
        columns.join(col => {
          const q = sql`${col.value(row)}`;
          if (col.cast != null) {
            q.appendString(col.cast);
          }

          return q;
        }, ",")
      )
      .appendString(")");

    if (!isLast) {
      q.appendString(",");
    }
  });

  return q;
}

module.exports = values;
