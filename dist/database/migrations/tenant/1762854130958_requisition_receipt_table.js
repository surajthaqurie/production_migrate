"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("material_requisition_receipt")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
        .addColumn("requisitionId", "uuid", (col) => col.references("material_requisitions.id").notNull().onDelete("restrict"))
        .addColumn("ratePerItem", "double precision", (col) => col.notNull())
        .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("totalPrice", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addUniqueConstraint("unique_requisition_product_receipt", ["productId", "requisitionId"])
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("material_requisition_receipt_idx").on("material_requisition_receipt").column("requisitionId").execute();
    await db.schema.createIndex("material_requisition_receipt_product_idx").on("material_requisition_receipt").column("productId").execute();
}
async function down(db) {
    await db.schema.dropIndex("material_requisition_receipt_idx").execute();
    await db.schema.dropIndex("material_requisition_receipt_product_idx").execute();
    await db.schema.dropTable("material_requisition_receipt").ifExists().execute();
}
//# sourceMappingURL=1762854130958_requisition_receipt_table.js.map