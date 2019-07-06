"use strict";

const forEach = require("./for-each");

class Query {
  constructor(queryParts = [], values = []) {
    this.query = queryParts;
    this.values = values || [];
  }

  append(other) {
    if (other instanceof Query) {
      this.appendQuery(other);
    } else if (typeof other === "string") {
      this.appendString(other);
    }
    return this;
  }

  appendString(str) {
    const l = this.query.length;
    if (l === 0) {
      this.query.push(str);
    } else {
      this.query[l - 1] = this.query[l - 1] + str;
    }
    return this;
  }

  appendValue(val) {
    this.query.push("");
    this.values.push(val);

    return this;
  }

  appendQuery(other) {
    this.appendString(other.query[0]);
    for (let i = 1; i < other.query.length; i++) {
      this.query.push(other.query[i]);
    }
    other.values.forEach(value => this.values.push(value));

    return this;
  }

  get text() {
    let text = "";
    let idx = 1;
    forEach(this.query, (part, isLast) => {
      text += part;
      if (!isLast) {
        text += "$" + idx;
        idx += 1;
      }
    });

    return text;
  }
}

function sql(parts, ...args) {
  return new Query([...parts], args);
}

module.exports = { sql, Query };
