"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `
    CREATE TYPE warehouse_type AS ENUM (
      'SELLABLE',
      'STORAGE_ONLY'
    )
  `.execute(db);
}
async function down(db) {
    await (0, kysely_1.sql) `DROP TYPE IF EXISTS warehouse_type CASCADE`.execute(db);
}
//# sourceMappingURL=1741063340158_warehouse_type.js.map