"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("stock_in_transit_openings")
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("previousFiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("stockInTransitId", "uuid", (col) => col.references("stock_in_transit.id").notNull().onDelete("restrict"))
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_stock_in_transit_opening", ["fiscalYear", "stockInTransitId"])
        .execute();
    await db.schema.createIndex("stock_in_transit_openings_stock_idx").on("stock_in_transit_openings").column("stockInTransitId").execute();
    await db.schema.createIndex("stock_in_transit_openings_fy_idx").on("stock_in_transit_openings").column("fiscalYear").execute();
    await db.schema.createIndex("stock_in_transit_openings_branch_idx").on("stock_in_transit_openings").column("branchId").execute();
}
async function down(db) {
    await db.schema.dropIndex("stock_in_transit_openings_stock_idx").execute();
    await db.schema.dropIndex("stock_in_transit_openings_fy_idx").execute();
    await db.schema.dropIndex("stock_in_transit_openings_branch_idx").execute();
    await db.schema.dropTable("stock_in_transit_openings").ifExists().execute();
}
//# sourceMappingURL=1765720193804_stock_in_transit_openings.js.map