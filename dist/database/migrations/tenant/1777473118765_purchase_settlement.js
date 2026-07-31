"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("purchase_settlements")
        .addColumn("billId", "uuid", (col) => col.primaryKey().references("purchase_order_bills.id").onDelete("restrict").notNull())
        .addColumn("code", "varchar(20)", (col) => col.notNull())
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("amount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("metadata", "jsonb")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
}
async function down(db) {
    await db.schema.dropTable("purchase_settlements").ifExists().execute();
}
//# sourceMappingURL=1777473118765_purchase_settlement.js.map