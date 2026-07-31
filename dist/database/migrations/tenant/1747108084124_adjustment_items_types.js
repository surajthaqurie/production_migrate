"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `
	CREATE TYPE adjustment_item_types AS ENUM (
	  'IN',
	  'OUT'
	)
  `.execute(db);
}
async function down(db) {
    await (0, kysely_1.sql) `DROP TYPE IF EXISTS adjustment_item_types CASCADE`.execute(db);
}
//# sourceMappingURL=1747108084124_adjustment_items_types.js.map