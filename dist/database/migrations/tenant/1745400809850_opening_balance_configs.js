"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("opening_balance_configs")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("sourceType", "varchar(10)", (col) => col.notNull())
        .addColumn("sourceDetail", "varchar(255)")
        .addColumn("bankId", "uuid", (col) => col.references("bank_accounts.id").onDelete("set null"))
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("openingBalance", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("closingBalance", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .execute();
    await db.schema.createIndex("opening_balance_configs_fiscal_year_idx").on("opening_balance_configs").column("fiscalYear").execute();
    await db.schema.createIndex("opening_balance_configs_branch_idx").on("opening_balance_configs").column("branchId").execute();
    await db.schema.createIndex("opening_balance_configs_bank_idx").on("opening_balance_configs").column("bankId").execute();
    await db.schema.createIndex("opening_balance_configs_source_type_idx").on("opening_balance_configs").column("sourceType").execute();
    await db.schema.createIndex("opening_balance_configs_branch_year_idx").on("opening_balance_configs").columns(["branchId", "fiscalYear"]).execute();
    await (0, kysely_1.sql) `CREATE UNIQUE INDEX opening_balance_unique_branch_bank_year ON opening_balance_configs ("branchId", "bankId", "fiscalYear") WHERE "sourceDetail" IS NULL AND "isDeleted" = false`.execute(db);
    await (0, kysely_1.sql) `CREATE UNIQUE INDEX opening_balance_unique_branch_cash_year ON opening_balance_configs ("branchId", "sourceDetail", "fiscalYear") WHERE "bankId" IS NULL AND "isDeleted" = false`.execute(db);
}
async function down(db) {
    await db.schema.dropIndex("opening_balance_unique_branch_bank_year").ifExists().execute();
    await db.schema.dropIndex("opening_balance_unique_branch_cash_year").ifExists().execute();
    await db.schema.dropIndex("opening_balance_configs_branch_year_idx").ifExists().execute();
    await db.schema.dropIndex("opening_balance_configs_source_type_idx").ifExists().execute();
    await db.schema.dropIndex("opening_balance_configs_bank_idx").ifExists().execute();
    await db.schema.dropIndex("opening_balance_configs_branch_idx").ifExists().execute();
    await db.schema.dropIndex("opening_balance_configs_fiscal_year_idx").ifExists().execute();
    await db.schema.dropTable("opening_balance_configs").ifExists().execute();
}
//# sourceMappingURL=1745400809850_opening_balance_configs.js.map