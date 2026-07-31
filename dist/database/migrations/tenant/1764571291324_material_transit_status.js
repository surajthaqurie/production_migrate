"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `
    CREATE TYPE material_transit_status AS ENUM (
      'IN_TRANSIT',
      'SETTLED',
      'VOIDED'     
    )
  `.execute(db);
}
async function down(db) {
    await (0, kysely_1.sql) `DROP TYPE IF EXISTS material_transit_status CASCADE`.execute(db);
}
//# sourceMappingURL=1764571291324_material_transit_status.js.map