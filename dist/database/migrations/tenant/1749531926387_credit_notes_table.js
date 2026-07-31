"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("credit_notes")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("code", "varchar(18)", (col) => col.unique().notNull())
        .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
        .addColumn("refNo", "varchar(100)")
        .addColumn("reason", "varchar(20)")
        .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
        .addColumn("warehouseId", "uuid", (col) => col.references("warehouses.id").onDelete("restrict"))
        .addColumn("status", (0, kysely_1.sql) `note_status`, (col) => col.notNull().defaultTo((0, kysely_1.sql) `'DRAFT'`))
        .addColumn("customerId", "uuid", (col) => col.references("customers.id").onDelete("restrict"))
        .addColumn("billId", "uuid", (col) => col.references("sales_order_bills.id").onDelete("restrict"))
        .addColumn("noteDate", "timestamptz")
        .addColumn("termsAndConditions", "text")
        .addUniqueConstraint("unique_bill_credit_code", ["code", "billId"])
        .addColumn("approvedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("approvedAt", "timestamptz")
        .addColumn("voidedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("voidedAt", "timestamptz")
        .addColumn("voidReason", "text")
        .addColumn("metadata", "json")
        .addColumn("taxableAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("nonTaxableAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("subTotal", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("totalDiscount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("totalVatAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("totalAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("discountValue", "double precision")
        .addColumn("discountType", (0, kysely_1.sql) `discount_type`)
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("credit_notes_billId_idx").on("credit_notes").column("billId").execute();
    await db.schema.createIndex("credit_notes_warehouseId_idx").on("credit_notes").column("warehouseId").execute();
    await db.schema.createIndex("credit_notes_fiscalYear_idx").on("credit_notes").column("fiscalYear").execute();
    await db.schema.createIndex("credit_notes_customerId_idx").on("credit_notes").column("customerId").execute();
    await db.schema.createIndex("credit_notes_branchId_idx").on("credit_notes").column("branchId").execute();
    await db.schema.createIndex("credit_notes_refNo_idx").on("credit_notes").column("refNo").execute();
}
async function down(db) {
    await db.schema.dropIndex("credit_notes_billId_idx").execute();
    await db.schema.dropIndex("credit_notes_warehouseId_idx").execute();
    await db.schema.dropIndex("credit_notes_fiscalYear_idx").execute();
    await db.schema.dropIndex("credit_notes_customerId_idx").execute();
    await db.schema.dropIndex("credit_notes_branchId_idx").execute();
    await db.schema.dropIndex("credit_notes_refNo_idx").execute();
    await db.schema.dropTable("credit_notes").ifExists().execute();
}
//# sourceMappingURL=1749531926387_credit_notes_table.js.map