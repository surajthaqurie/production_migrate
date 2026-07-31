import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("tenant_payments")

    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("code", "varchar(20)", (col) => col.notNull().unique())

    .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
    .addColumn("subscriptionId", "uuid", (col) => col.notNull().references("subscriptions.id").onDelete("restrict"))
    .addColumn("planId", "uuid", (col) => col.notNull().references("system_plans.id").onDelete("restrict")) // snapshot — plan can change on upgrade/downgrade
    .addColumn("paymentMethodId", "uuid", (col) => col.notNull().references("payment_methods.id").onDelete("restrict"))

    .addColumn("amount", "double precision", (col) => col.notNull())
    .addColumn("currency", "varchar(3)", (col) => col.notNull().defaultTo("NPR"))

    .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("PENDING")) // PENDING | VERIFIED | FAILED | REFUND

    .addColumn("paidAt", "timestamptz")

    .addColumn("periodStart", "timestamptz", (col) => col.notNull())
    .addColumn("periodEnd", "timestamptz", (col) => col.notNull())

    // External gateway reference (Stripe charge ID, eSewa txn ID, etc.)
    .addColumn("providerTransactionId", "varchar(255)")

    .addColumn("verifiedBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
    .addColumn("verifiedAt", "timestamptz")

    .addColumn("refundAmount", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("refundedBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
    .addColumn("refundedAt", "timestamptz")

    // Failure details — gateway error message or admin rejection reason
    .addColumn("failureReason", "text")

    .addColumn("remark", "text")
    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("idx_tenant_payments_status").on("tenant_payments").column("status").execute();
  await db.schema.createIndex("idx_tenant_payments_tenant").on("tenant_payments").column("tenantId").execute();
  await db.schema.createIndex("idx_tenant_payments_subscription").on("tenant_payments").column("subscriptionId").execute();

  await db.schema.createIndex("idx_tenant_payments_tenant_status").on("tenant_payments").columns(["tenantId", "status"]).execute();
  await db.schema.createIndex("idx_tenant_payments_subscription_status").on("tenant_payments").columns(["subscriptionId", "status"]).execute();
  await db.schema.createIndex("idx_tenant_payments_paid_at").on("tenant_payments").columns(["tenantId", "paidAt"]).where(sql.ref("status"), "=", "VERIFIED").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("idx_tenant_payments_paid_at").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_payments_subscription_status").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_payments_tenant_status").ifExists().execute();

  await db.schema.dropIndex("idx_tenant_payments_subscription").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_payments_tenant").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_payments_status").ifExists().execute();

  //Drop table
  await db.schema.dropTable("tenant_payments").ifExists().execute();
}
