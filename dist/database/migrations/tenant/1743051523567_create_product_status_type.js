"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `
    CREATE TYPE product_status AS ENUM (
      'NO_STOCK',
      'ON_STOCK',
      'OUT_OF_STOCK',
      'MODERATE_STOCK',
      'LOW_STOCK'
    )
  `.execute(db);
}
async function down(db) {
    await (0, kysely_1.sql) `DROP TYPE IF EXISTS product_status CASCADE`.execute(db);
}
//# sourceMappingURL=1743051523567_create_product_status_type.js.map