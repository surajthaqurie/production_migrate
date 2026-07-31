"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `
    CREATE TYPE discount_type AS ENUM (
      'AMOUNT',
      'PERCENTAGE'      
    )
  `.execute(db);
}
async function down(db) {
    await (0, kysely_1.sql) `DROP TYPE IF EXISTS discount_type CASCADE`.execute(db);
}
//# sourceMappingURL=1780566006760_discount_type.js.map