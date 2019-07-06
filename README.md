# ingo-pg

Small wrapper around `node-pg` including patched `node-pg-query-stream` to make it work with node v11.
It contains set of patches to fix int8 to integer conversion.

To use:
```js
const { db } = require('ingo-pg');

db.initPool({ /* node-pg pool options */ });

const result = await db.run('select 1');
```

It has safe query builder:
```js
const { sql } = require('ingo-pg');

const id = 1;
const q = sql`select col from tbl where id = ${id}`;

db.run(q);
```

It has helpers for update and insert statements, use `updateSet`,
  `values`,
  `insert` functions exported from `ingo-pg`.


