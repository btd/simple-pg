"use strict";

const { sql } = require("./sql");

const arr = require("arrify");

const { Columns } = require("./columns");

const assert = require("assert").strict;

const values = require("./values");

function insert(tableName, rows, { returnRows = false, onConflict = null, columns = null } = {}) {
  rows = arr(rows);
  assert(rows.length !== 0, "Empty insert rows");
  columns = columns == null ? new Columns(Object.keys(rows[0]).map(name => ({ name }))) : columns;
  const q = sql`insert into `
    .appendString(tableName)
    .appendString("(")
    .append(columns.join(col => sql``.appendString(col.name), ","))
    .appendString(")")
    .appendString(" values ")
    .append(values(rows, columns));

  if (onConflict != null) {
    q.appendString(" on conflict ").append(onConflict);
  }

  if (returnRows) {
    q.appendString(" returning *");
  }

  return q;
}

module.exports = insert;
