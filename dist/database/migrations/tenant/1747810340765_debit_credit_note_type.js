"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `
	CREATE TYPE note_status AS ENUM (
	  'DRAFT',
	  'PENDING',
	  'APPROVED',
	  'VOID'      
	)
  `.execute(db);
}
async function down(db) {
    await (0, kysely_1.sql) `DROP TYPE IF EXISTS note_status CASCADE`.execute(db);
}
//# sourceMappingURL=1747810340765_debit_credit_note_type.js.map