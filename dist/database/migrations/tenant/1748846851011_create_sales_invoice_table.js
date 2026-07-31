"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("sales_order_bills")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("code", "varchar(18)", (col) => col.notNull())
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("receivedAmount", "double precision", (col) => col.defaultTo(0))
        .addColumn("totalAmount", "double precision", (col) => col.defaultTo(0))
        .addColumn("warehouseId", "uuid", (col) => col.references("warehouses.id").onDelete("restrict"))
        .addColumn("status", (0, kysely_1.sql) `order_bill_status`, (col) => col.notNull().defaultTo((0, kysely_1.sql) `'DRAFT'`))
        .addColumn("creditTermsId", "uuid", (col) => col.references("credit_terms.id").onDelete("restrict"))
        .addColumn("customerId", "uuid", (col) => col.references("customers.id").onDelete("restrict"))
        .addColumn("salesOrderId", "uuid", (col) => col.references("sales_orders.id").onDelete("set null"))
        .addColumn("customerInVoiceNumber", "varchar")
        .addColumn("billDate", "timestamptz")
        .addColumn("dueDate", "timestamptz")
        .addColumn("approvedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("approvedAt", "timestamptz")
        .addColumn("voidedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("voidedAt", "timestamptz")
        .addColumn("termsAndConditions", "text")
        .addColumn("metadata", "json")
        .addColumn("taxableAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("nonTaxableAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("subTotal", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("totalDiscount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("totalVatAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("discountType", (0, kysely_1.sql) `discount_type`)
        .addColumn("discountValue", "double precision")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("sales_order_bills_warehouseId_idx").on("sales_order_bills").column("warehouseId").execute();
    await db.schema.createIndex("sales_order_bills_fiscalYear_idx").on("sales_order_bills").column("fiscalYear").execute();
    await db.schema.createIndex("sales_order_bills_customerId_idx").on("sales_order_bills").column("customerId").execute();
    await db.schema.createIndex("sales_order_bills_branchId_idx").on("sales_order_bills").column("branchId").execute();
    await db.schema.createIndex("sales_order_bills_code_idx").on("sales_order_bills").column("code").execute();
    await db.schema.createIndex("sales_order_bills_customerInVoiceNumber_idx").on("sales_order_bills").column("customerInVoiceNumber").execute();
}
async function down(db) {
    await db.schema.dropIndex("sales_order_bills_code_idx").execute();
    await db.schema.dropIndex("sales_order_bills_warehouseId_idx").execute();
    await db.schema.dropIndex("sales_order_bills_customerId_idx").execute();
    await db.schema.dropIndex("sales_order_bills_fiscalYear_idx").execute();
    await db.schema.dropIndex("sales_order_bills_branchId_idx").execute();
    await db.schema.dropIndex("sales_order_bills_customerInVoiceNumber_idx").execute();
    await db.schema.dropTable("sales_order_bills").ifExists().execute();
}
//# sourceMappingURL=1748846851011_create_sales_invoice_table.js.map