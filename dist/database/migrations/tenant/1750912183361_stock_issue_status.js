"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `
    CREATE TYPE material_transfer_status AS ENUM (
      -- 'DRAFT',
      'PENDING',
      'APPROVED',
      'VOID',
      'IN_TRANSIT',
      'COMPLETED'
    )
  `.execute(db);
}
async function down(db) {
    await (0, kysely_1.sql) `DROP TYPE IF EXISTS material_transfer_status CASCADE`.execute(db);
}
//# sourceMappingURL=1750912183361_stock_issue_status.js.map