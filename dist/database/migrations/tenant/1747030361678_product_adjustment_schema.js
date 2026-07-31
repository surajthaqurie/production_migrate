"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("product_adjustments")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("code", "varchar(18)", (col) => col.notNull())
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("refNo", "varchar(100)")
        .addColumn("totalAmount", "double precision", (col) => col.notNull())
        .addColumn("status", (0, kysely_1.sql) `product_adjustment_status`, (col) => col.notNull().defaultTo((0, kysely_1.sql) `'DRAFT'`))
        .addColumn("adjustmentDate", "timestamptz")
        .addColumn("adjustmentReason", "text")
        .addColumn("warehouseId", "uuid", (col) => col.references("warehouses.id").onDelete("restrict"))
        .addColumn("approvedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("approvedAt", "timestamptz")
        .addColumn("voidedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("voidReason", "text")
        .addColumn("voidedAt", "timestamptz")
        .addColumn("description", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("product_adjustments_warehouseId_idx").on("product_adjustments").column("warehouseId").execute();
    await db.schema.createIndex("product_adjustments_fiscalYear_idx").on("product_adjustments").column("fiscalYear").execute();
    await db.schema.createIndex("product_adjustments_branchId_idx").on("product_adjustments").column("branchId").execute();
    await db.schema.createIndex("product_adjustments_code_idx").on("product_adjustments").column("code").execute();
    await db.schema.createIndex("product_adjustments_refNo_idx").on("product_adjustments").column("refNo").execute();
}
async function down(db) {
    await db.schema.dropIndex("product_adjustments_code_idx").execute();
    await db.schema.dropIndex("product_adjustments_warehouseId_idx").execute();
    await db.schema.dropIndex("product_adjustments_fiscalYear_idx").execute();
    await db.schema.dropIndex("product_adjustments_branchId_idx").execute();
    await db.schema.dropIndex("product_adjustments_refNo_idx").execute();
    await db.schema.dropTable("product_adjustments").ifExists().execute();
}
//# sourceMappingURL=1747030361678_product_adjustment_schema.js.map