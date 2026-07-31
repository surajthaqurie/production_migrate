"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("material_requisition_transit")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
        .addColumn("requisitionId", "uuid", (col) => col.references("material_requisitions.id").notNull().onDelete("restrict"))
        .addColumn("ratePerItem", "double precision", (col) => col.notNull())
        .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("totalPrice", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addUniqueConstraint("unique_requisition_product_transit", ["productId", "requisitionId"])
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("requisition_transit_idx").on("material_requisition_transit").column("requisitionId").execute();
    await db.schema.createIndex("requisition_transit_product_idx").on("material_requisition_transit").column("productId").execute();
}
async function down(db) {
    await db.schema.dropIndex("requisition_transit_idx").execute();
    await db.schema.dropIndex("requisition_transit_product_idx").execute();
    await db.schema.dropTable("material_requisition_transit").ifExists().execute();
}
//# sourceMappingURL=1762852071958_material_requisition_transit_table.js.map