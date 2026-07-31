"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("tenant_payments")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("code", "varchar(20)", (col) => col.notNull().unique())
        .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
        .addColumn("subscriptionId", "uuid", (col) => col.notNull().references("subscriptions.id").onDelete("restrict"))
        .addColumn("planId", "uuid", (col) => col.notNull().references("system_plans.id").onDelete("restrict"))
        .addColumn("paymentMethodId", "uuid", (col) => col.notNull().references("payment_methods.id").onDelete("restrict"))
        .addColumn("amount", "double precision", (col) => col.notNull())
        .addColumn("currency", "varchar(3)", (col) => col.notNull().defaultTo("NPR"))
        .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("PENDING"))
        .addColumn("paidAt", "timestamptz")
        .addColumn("periodStart", "timestamptz", (col) => col.notNull())
        .addColumn("periodEnd", "timestamptz", (col) => col.notNull())
        .addColumn("providerTransactionId", "varchar(255)")
        .addColumn("verifiedBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("verifiedAt", "timestamptz")
        .addColumn("refundAmount", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("refundedBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
        .addColumn("refundedAt", "timestamptz")
        .addColumn("failureReason", "text")
        .addColumn("remark", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("idx_tenant_payments_status").on("tenant_payments").column("status").execute();
    await db.schema.createIndex("idx_tenant_payments_tenant").on("tenant_payments").column("tenantId").execute();
    await db.schema.createIndex("idx_tenant_payments_subscription").on("tenant_payments").column("subscriptionId").execute();
    await db.schema.createIndex("idx_tenant_payments_tenant_status").on("tenant_payments").columns(["tenantId", "status"]).execute();
    await db.schema.createIndex("idx_tenant_payments_subscription_status").on("tenant_payments").columns(["subscriptionId", "status"]).execute();
    await db.schema.createIndex("idx_tenant_payments_paid_at").on("tenant_payments").columns(["tenantId", "paidAt"]).where(kysely_1.sql.ref("status"), "=", "VERIFIED").execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_tenant_payments_paid_at").ifExists().execute();
    await db.schema.dropIndex("idx_tenant_payments_subscription_status").ifExists().execute();
    await db.schema.dropIndex("idx_tenant_payments_tenant_status").ifExists().execute();
    await db.schema.dropIndex("idx_tenant_payments_subscription").ifExists().execute();
    await db.schema.dropIndex("idx_tenant_payments_tenant").ifExists().execute();
    await db.schema.dropIndex("idx_tenant_payments_status").ifExists().execute();
    await db.schema.dropTable("tenant_payments").ifExists().execute();
}
//# sourceMappingURL=1781255674153_create_tenant_payment_schema.js.map