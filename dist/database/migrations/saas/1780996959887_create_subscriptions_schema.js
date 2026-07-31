"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("subscriptions")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
        .addColumn("planId", "uuid", (col) => col.references("system_plans.id").onDelete("restrict"))
        .addColumn("code", "varchar(20)", (col) => col.notNull().unique())
        .addColumn("status", "varchar(20)", (col) => col.notNull())
        .addColumn("prevStatus", "varchar(20)", (col) => col.notNull())
        .addColumn("trialStart", "timestamptz")
        .addColumn("trialEnd", "timestamptz")
        .addColumn("trialExtendedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("trialExtendReason", "text")
        .addColumn("trialExtendedAt", "timestamptz")
        .addColumn("currentPeriodStart", "timestamptz", (col) => col.notNull())
        .addColumn("currentPeriodEnd", "timestamptz", (col) => col.notNull())
        .addColumn("cancelAtPeriodEnd", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("endedAt", "timestamptz")
        .addColumn("cancelledBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("cancelReason", "text")
        .addColumn("price", "double precision")
        .addColumn("currency", "varchar(3)")
        .addColumn("paymentMethodId", "uuid", (col) => col.references("payment_methods.id").onDelete("restrict"))
        .addColumn("providerSubscriptionId", "varchar(255)")
        .addColumn("remarks", "text")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("idx_subscriptions_tenant_status").on("subscriptions").columns(["tenantId", "status"]).execute();
    await db.schema.createIndex("idx_subscriptions_tenant_created_at").on("subscriptions").columns(["tenantId", "createdAt"]).execute();
    await db.schema.createIndex("idx_subscriptions_trial_end").on("subscriptions").columns(["trialEnd", "status"]).where("status", "=", "TRIAL").execute();
    await db.schema.createIndex("idx_subscriptions_active_expiry").on("subscriptions").columns(["currentPeriodEnd", "status"]).where(kysely_1.sql.ref("endedAt"), "is", null).execute();
    await db.schema.createIndex("idx_subscriptions_trial_extended").on("subscriptions").column("trialExtendedAt").where(kysely_1.sql.ref("trialExtendedAt"), "is not", null).execute();
    await db.schema.createIndex("idx_subscriptions_plan").on("subscriptions").column("planId").execute();
    await db.schema.createIndex("idx_subscriptions_payment_method").on("subscriptions").column("paymentMethodId").where(kysely_1.sql.ref("paymentMethodId"), "is not", null).execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_subscriptions_payment_method").ifExists().execute();
    await db.schema.dropIndex("idx_subscriptions_plan").ifExists().execute();
    await db.schema.dropIndex("idx_subscriptions_trial_extended").ifExists().execute();
    await db.schema.dropIndex("idx_subscriptions_active_expiry").ifExists().execute();
    await db.schema.dropIndex("idx_subscriptions_trial_end").ifExists().execute();
    await db.schema.dropIndex("idx_subscriptions_tenant_created_at").ifExists().execute();
    await db.schema.dropIndex("idx_subscriptions_tenant_status").ifExists().execute();
    await db.schema.dropTable("subscriptions").ifExists().execute();
}
//# sourceMappingURL=1780996959887_create_subscriptions_schema.js.map