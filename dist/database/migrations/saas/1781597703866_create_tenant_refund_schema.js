"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("tenant_refunds")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("code", "varchar(20)", (col) => col.notNull().unique())
        .addColumn("paymentId", "uuid", (col) => col.notNull().references("tenant_payments.id").onDelete("restrict"))
        .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
        .addColumn("subscriptionId", "uuid", (col) => col.notNull().references("subscriptions.id").onDelete("restrict"))
        .addColumn("amount", "double precision", (col) => col.notNull())
        .addColumn("currency", "varchar(3)", (col) => col.notNull().defaultTo("NPR"))
        .addColumn("refundMethod", "varchar(30)", (col) => col.notNull().defaultTo("ORIGINAL_PAYMENT_METHOD"))
        .addColumn("status", "varchar(30)", (col) => col.notNull().defaultTo("PENDING"))
        .addColumn("reason", "text", (col) => col.notNull())
        .addColumn("remark", "text")
        .addColumn("approvedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("approvedAt", "timestamptz")
        .addColumn("rejectedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("rejectedAt", "timestamptz")
        .addColumn("rejectionReason", "text")
        .addColumn("providerRefundId", "varchar(255)")
        .addColumn("refundedAt", "timestamptz")
        .addColumn("failureReason", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("deletedReason", "text")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("idx_tenant_refunds_tenant_status").on("tenant_refunds").columns(["tenantId", "status"]).execute();
    await db.schema.createIndex("idx_tenant_refunds_payment").on("tenant_refunds").column("paymentId").execute();
    await db.schema.createIndex("idx_tenant_refunds_subscription").on("tenant_refunds").column("subscriptionId").execute();
    await db.schema.createIndex("idx_tenant_refunds_provider_refund_id").on("tenant_refunds").column("providerRefundId").execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_tenant_refunds_provider_refund_id").ifExists().execute();
    await db.schema.dropIndex("idx_tenant_refunds_subscription").ifExists().execute();
    await db.schema.dropIndex("idx_tenant_refunds_payment").ifExists().execute();
    await db.schema.dropIndex("idx_tenant_refunds_tenant_status").ifExists().execute();
    await db.schema.dropTable("tenant_refunds").ifExists().execute();
}
//# sourceMappingURL=1781597703866_create_tenant_refund_schema.js.map