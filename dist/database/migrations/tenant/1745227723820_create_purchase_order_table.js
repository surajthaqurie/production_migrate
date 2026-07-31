"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("purchase_orders")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("code", "varchar(18)", (col) => col.notNull())
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("refNo", "varchar(100)")
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("supplierId", "uuid", (col) => col.references("suppliers.id").onDelete("restrict"))
        .addColumn("warehouseId", "uuid", (col) => col.references("warehouses.id").onDelete("restrict"))
        .addUniqueConstraint("unique_orders_code_per_supplier", ["code", "supplierId"])
        .addColumn("creditTermsId", "uuid", (col) => col.references("credit_terms.id").onDelete("restrict"))
        .addColumn("status", (0, kysely_1.sql) `order_grn_status`, (col) => col.notNull().defaultTo((0, kysely_1.sql) `'DRAFT'`))
        .addColumn("expectedDeliveryAt", "timestamptz")
        .addColumn("termsAndConditions", "text")
        .addColumn("metadata", "json")
        .addColumn("taxableAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("nonTaxableAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("subTotal", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("totalDiscount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("totalVatAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("totalAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("discountType", (0, kysely_1.sql) `discount_type`)
        .addColumn("discountValue", "double precision")
        .addColumn("approvedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("approvedAt", "timestamptz")
        .addColumn("voidedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("voidReason", "text")
        .addColumn("voidedAt", "timestamptz")
        .addColumn("completedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("completedAt", "timestamptz")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("purchase_orders_warehouseId_idx").on("purchase_orders").column("warehouseId").execute();
    await db.schema.createIndex("purchase_orders_supplierId_idx").on("purchase_orders").column("supplierId").execute();
    await db.schema.createIndex("purchase_orders_fiscalYear_idx").on("purchase_orders").column("fiscalYear").execute();
    await db.schema.createIndex("purchase_orders_branchId_idx").on("purchase_orders").column("branchId").execute();
    await db.schema.createIndex("purchase_orders_code_idx").on("purchase_orders").column("code").execute();
    await db.schema.createIndex("purchase_orders_refNo_idx").on("purchase_orders").column("refNo").execute();
}
async function down(db) {
    await db.schema.dropIndex("purchase_orders_code_idx").execute();
    await db.schema.dropIndex("purchase_orders_warehouseId_idx").execute();
    await db.schema.dropIndex("purchase_orders_supplierId_idx").execute();
    await db.schema.dropIndex("purchase_orders_fiscalYear_idx").execute();
    await db.schema.dropIndex("purchase_orders_branchId_idx").execute();
    await db.schema.dropIndex("purchase_orders_refNo_idx").execute();
    await db.schema.dropTable("purchase_orders").ifExists().execute();
}
//# sourceMappingURL=1745227723820_create_purchase_order_table.js.map