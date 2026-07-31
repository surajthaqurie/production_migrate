"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("tenant_branch_payment_documents")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("branchId", "uuid", (col) => col.notNull().references("tenant_branches.id").onDelete("cascade"))
        .addColumn("paymentId", "uuid", (col) => col.notNull().references("tenant_branch_payments.id").onDelete("cascade"))
        .addColumn("fileId", "uuid", (col) => col.notNull().references("system_files.id").onDelete("restrict"))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("idx_tenant_branch_payment_documents_payment").on("tenant_branch_payment_documents").column("paymentId").execute();
    await db.schema.createIndex("idx_tenant_branch_payment_documents_branch").on("tenant_branch_payment_documents").column("branchId").execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_tenant_branch_payment_documents_branch").ifExists().execute();
    await db.schema.dropIndex("idx_tenant_branch_payment_documents_payment").ifExists().execute();
    await db.schema.dropTable("tenant_branch_payment_documents").ifExists().execute();
}
//# sourceMappingURL=1784693439449_create_tenant_branch_payment_document_schema.js.map