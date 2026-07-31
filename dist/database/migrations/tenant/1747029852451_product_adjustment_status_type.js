"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `
    CREATE TYPE product_adjustment_status AS ENUM (
      'DRAFT',
      'PENDING',
      'APPROVED',
      'VOID'      
    )
  `.execute(db);
}
async function down(db) {
    await (0, kysely_1.sql) `DROP TYPE IF EXISTS product_adjustment_status CASCADE`.execute(db);
}
//# sourceMappingURL=1747029852451_product_adjustment_status_type.js.map