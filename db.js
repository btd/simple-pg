"use strict";

const Pool = require("pg-pool");

const { Query } = require("./sql");

const QueryStream = require("./query-stream");

class DBHolder {
  initPool(options = {}) {
    const opts = Object.assign(
      {
        min: 3,
        max: 30
      },
      options
    );
    this.pool = new Pool(opts);
  }

  // proxy to pool.query
  query(text, args = []) {
    if (text == null) {
      throw new Error("Null query text");
    }
    return this.pool.query(text, args).then(res => res.rows);
  }

  // run query object
  run(query) {
    const [text, args] = this._processInput(query);
    return this.query(text, args);
  }

  runOne(query) {
    return this.run(query).then(rows => rows[0]);
  }

  generateCall(query, { oneRow = false } = {}) {
    const { text, values } = query;

    values.forEach((v, idx) => {
      if (typeof v !== "string") {
        throw new Error(
          `Could not generate call for query:
          ${text}
          parameter ${idx} is not a string: ${v}
        `
        );
      }
    });

    const f = `
    return function(opts) {
      return pool.query(${JSON.stringify(text)}, [${values
      .map(v => `opts[${JSON.stringify(v.toString())}]`)
      .join(", ")}])
        ${oneRow ? ".then(rows => rows[0])" : ""}
    }`;

    return new Function("pool", f)(this);
  }

  _processInput(query) {
    if (typeof query === "string") {
      return [query, []];
    } else if (query instanceof Query) {
      return [query.text, query.values];
    } else {
      throw new Error("Unsupported query format");
    }
  }

  async stream(query, opts = {}) {
    const [text, args] = this._processInput(query);

    const client = await this.pool.connect();

    const stream = client.query(new QueryStream(text, args), opts);
    stream.on("end", function() {
      client.release();
    });
    return stream;
  }
}

module.exports = { DBHolder };
