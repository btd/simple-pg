"use strict";

const { sql, Query } = require("./sql");
const updateSet = require("./update-set");
const values = require("./values");
const insert = require("./insert");
const { DBHolder } = require("./db");
const { Columns, Column } = require("./columns");

const db = new DBHolder();

module.exports = {
  sql,
  Query,
  updateSet,
  values,
  insert,
  db,
  DBHolder,
  Columns,
  Column
};
