"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("purchase_order_bills")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("code", "varchar(18)", (col) => col.notNull())
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("totalAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("receivedAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("supplierId", "uuid", (col) => col.references("suppliers.id").onDelete("restrict"))
        .addColumn("creditTermsId", "uuid", (col) => col.references("credit_terms.id").onDelete("restrict"))
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("warehouseId", "uuid", (col) => col.references("warehouses.id").onDelete("restrict"))
        .addColumn("purchaseOrderId", "uuid", (col) => col.references("purchase_orders.id").onDelete("set null"))
        .addColumn("purchaseGrnId", "uuid", (col) => col.references("purchase_grn.id").onDelete("set null"))
        .addColumn("supplierInVoiceNumber", "varchar")
        .addColumn("status", (0, kysely_1.sql) `order_bill_status`, (col) => col.notNull().defaultTo((0, kysely_1.sql) `'DRAFT'`))
        .addColumn("billDate", "timestamptz", (col) => col.notNull())
        .addColumn("dueDate", "timestamptz")
        .addColumn("approvedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("approvedAt", "timestamptz")
        .addColumn("voidedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("voidedAt", "timestamptz")
        .addColumn("voidReason", "text")
        .addColumn("hasTDS", "boolean", (col) => col.defaultTo(false))
        .addColumn("tdsInfo", "json")
        .addColumn("termsAndConditions", "text")
        .addColumn("metadata", "json")
        .addColumn("taxableAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("nonTaxableAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("subTotal", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("totalDiscount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("totalVatAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("discountValue", "double precision")
        .addColumn("discountType", (0, kysely_1.sql) `discount_type`)
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("purchase_order_bills_warehouseId_idx").on("purchase_order_bills").column("warehouseId").execute();
    await db.schema.createIndex("purchase_order_bills_fiscalYear_idx").on("purchase_order_bills").column("fiscalYear").execute();
    await db.schema.createIndex("purchase_order_bills_supplierId_idx").on("purchase_order_bills").column("supplierId").execute();
    await db.schema.createIndex("purchase_order_bills_branchId_idx").on("purchase_order_bills").column("branchId").execute();
    await db.schema.createIndex("purchase_order_bills_code_idx").on("purchase_order_bills").column("code").execute();
    await db.schema.createIndex("purchase_order_bills_supplierInVoiceNumber_idx").on("purchase_order_bills").column("supplierInVoiceNumber").execute();
}
async function down(db) {
    await db.schema.dropIndex("purchase_order_bills_code_idx").execute();
    await db.schema.dropIndex("purchase_order_bills_warehouseId_idx").execute();
    await db.schema.dropIndex("purchase_order_bills_fiscalYear_idx").execute();
    await db.schema.dropIndex("purchase_order_bills_supplierId_idx").execute();
    await db.schema.dropIndex("purchase_order_bills_branchId_idx").execute();
    await db.schema.dropIndex("purchase_order_bills_supplierInVoiceNumber_idx").execute();
    await db.schema.dropTable("purchase_order_bills").ifExists().execute();
}
//# sourceMappingURL=1745403893691_create_purchase_order_bill_schema.ts.js.map