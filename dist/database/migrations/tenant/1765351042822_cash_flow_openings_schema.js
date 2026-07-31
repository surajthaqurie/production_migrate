"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("cash_flow_openings")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("openingDate", "date", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_DATE`))
        .addColumn("amount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_openings_branch_fiscal_date", ["branchId", "fiscalYear", "openingDate"])
        .execute();
    await db.schema.createIndex("cash_flow_openings_branch_idx").on("cash_flow_openings").column("branchId").execute();
    await db.schema.createIndex("cash_flow_openings_fiscal_idx").on("cash_flow_openings").column("fiscalYear").execute();
    await db.schema.createIndex("cash_flow_openings_branch_fiscal_date_idx").on("cash_flow_openings").columns(["branchId", "fiscalYear", "openingDate"]).execute();
}
async function down(db) {
    await db.schema.dropIndex("cash_flow_openings_branch_idx").execute();
    await db.schema.dropIndex("cash_flow_openings_fiscal_idx").execute();
    await db.schema.dropIndex("cash_flow_openings_branch_fiscal_date_idx").execute();
    await db.schema.dropTable("cash_flow_openings").ifExists().execute();
}
//# sourceMappingURL=1765351042822_cash_flow_openings_schema.js.map