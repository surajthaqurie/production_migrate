import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("subscriptions")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
    .addColumn("planId", "uuid", (col) => col.references("system_plans.id").onDelete("restrict")) // NULLABLE — no plan during trial

    .addColumn("code", "varchar(20)", (col) => col.notNull().unique())
    .addColumn("status", "varchar(20)", (col) => col.notNull())
    .addColumn("prevStatus", "varchar(20)", (col) => col.notNull())

    // Trial window (null = never trialed; the trialing state itself is status = 'trialing')
    .addColumn("trialStart", "timestamptz")
    .addColumn("trialEnd", "timestamptz")

    .addColumn("trialExtendedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("trialExtendReason", "text")
    .addColumn("trialExtendedAt", "timestamptz")

    // Billing periods
    .addColumn("currentPeriodStart", "timestamptz", (col) => col.notNull())
    .addColumn("currentPeriodEnd", "timestamptz", (col) => col.notNull())

    // Cancellation
    .addColumn("cancelAtPeriodEnd", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("endedAt", "timestamptz") // null = live record; non-null = historical (each lifecycle event creates a new record)

    .addColumn("cancelledBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("cancelReason", "text")

    // Price snapshot at subscribe time (nullable when no plan)
    .addColumn("price", "double precision")
    .addColumn("currency", "varchar(3)")

    // Payment
    .addColumn("paymentMethodId", "uuid", (col) => col.references("payment_methods.id").onDelete("restrict")) // NULLABLE — no method during trial
    .addColumn("providerSubscriptionId", "varchar(255)")

    .addColumn("remarks", "text")
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    // .addCheckConstraint("subscriptions_status_check", sql`status IN ('trialing', 'active', 'past_due', 'canceled', 'expired')`)
    // .addCheckConstraint("subscriptions_period_valid_check", sql`"currentPeriodEnd" > "currentPeriodStart"`)
    // .addCheckConstraint("subscriptions_trial_valid_check", sql`"trialStart" IS NULL OR "trialEnd" IS NULL OR "trialEnd" >= "trialStart"`)
    // .addCheckConstraint("subscriptions_price_non_negative_check", sql`price IS NULL OR price >= 0`)
    .execute();

  await db.schema.createIndex("idx_subscriptions_tenant_status").on("subscriptions").columns(["tenantId", "status"]).execute();
  await db.schema.createIndex("idx_subscriptions_tenant_created_at").on("subscriptions").columns(["tenantId", "createdAt"]).execute();
  await db.schema.createIndex("idx_subscriptions_trial_end").on("subscriptions").columns(["trialEnd", "status"]).where("status", "=", "TRIAL").execute();
  await db.schema.createIndex("idx_subscriptions_active_expiry").on("subscriptions").columns(["currentPeriodEnd", "status"]).where(sql.ref("endedAt"), "is", null).execute();
  await db.schema.createIndex("idx_subscriptions_trial_extended").on("subscriptions").column("trialExtendedAt").where(sql.ref("trialExtendedAt"), "is not", null).execute();
  await db.schema.createIndex("idx_subscriptions_plan").on("subscriptions").column("planId").execute();
  await db.schema.createIndex("idx_subscriptions_payment_method").on("subscriptions").column("paymentMethodId").where(sql.ref("paymentMethodId"), "is not", null).execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("idx_subscriptions_payment_method").ifExists().execute();
  await db.schema.dropIndex("idx_subscriptions_plan").ifExists().execute();
  await db.schema.dropIndex("idx_subscriptions_trial_extended").ifExists().execute();
  await db.schema.dropIndex("idx_subscriptions_active_expiry").ifExists().execute();
  await db.schema.dropIndex("idx_subscriptions_trial_end").ifExists().execute();
  await db.schema.dropIndex("idx_subscriptions_tenant_created_at").ifExists().execute();
  await db.schema.dropIndex("idx_subscriptions_tenant_status").ifExists().execute();

  //Drop table
  await db.schema.dropTable("subscriptions").ifExists().execute();
}
