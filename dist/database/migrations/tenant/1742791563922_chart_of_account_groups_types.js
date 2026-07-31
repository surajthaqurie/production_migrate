"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `
    CREATE TYPE account_chart_groups AS ENUM (
      'ASSET', --1000 – 1999
      'LIABILITY', --2000 – 2999
      'EQUITY', --3000 – 3999
      'REVENUE', --4000 – 4999
      'EXPENSE' --5000-5999
    )
  `.execute(db);
}
async function down(db) {
    await (0, kysely_1.sql) `DROP TYPE IF EXISTS account_chart_groups CASCADE`.execute(db);
}
//# sourceMappingURL=1742791563922_chart_of_account_groups_types.js.map