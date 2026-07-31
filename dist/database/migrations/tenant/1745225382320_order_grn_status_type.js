"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.skip_down = skip_down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `
    CREATE TYPE order_grn_status AS ENUM (
      'DRAFT',
      'PENDING',
      'APPROVED',
      'VOID',
      'COMPLETED'      
    )
  `.execute(db);
}
async function skip_down(db) {
    await (0, kysely_1.sql) `DROP TYPE IF EXISTS order_grn_status CASCADE`.execute(db);
}
//# sourceMappingURL=1745225382320_order_grn_status_type.js.map