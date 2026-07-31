"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `
    CREATE TYPE bank_account_type AS ENUM (
      'SAVING',
      'CURRENT'
    )
  `.execute(db);
}
async function down(db) {
    await (0, kysely_1.sql) `DROP TYPE IF EXISTS bank_account_type CASCADE`.execute(db);
}
//# sourceMappingURL=1745374123989_bank_account_type.js.map