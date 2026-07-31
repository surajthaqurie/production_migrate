"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `
    CREATE TYPE order_bill_status AS ENUM (
      'DRAFT',
      'PENDING',
      'APPROVED',
      'PARTIAL_PAID',
      'COMPLETED',
      'VOID'      
    )
  `.execute(db);
}
async function down(db) {
    await (0, kysely_1.sql) `DROP TYPE IF EXISTS order_bill_status CASCADE`.execute(db);
}
//# sourceMappingURL=1745400809853_order_bill_status_type.js.map