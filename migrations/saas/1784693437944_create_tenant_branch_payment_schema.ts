import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("tenant_branch_payments")

    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("code", "varchar(20)", (col) => col.notNull().unique())

    .addColumn("branchId", "uuid", (col) => col.notNull().references("tenant_branches.id").onDelete("cascade"))
    .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
    .addColumn("paymentMethodId", "uuid", (col) => col.notNull().references("payment_methods.id").onDelete("restrict"))

    .addColumn("amount", "double precision", (col) => col.notNull())
    .addColumn("currency", "varchar(3)", (col) => col.notNull().defaultTo("NPR"))

    .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("PENDING")) // PENDING | VERIFIED | FAILED | REFUNDED

    .addColumn("paidAt", "timestamptz")

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

  await db.schema.createIndex("idx_tenant_branch_payments_status").on("tenant_branch_payments").column("status").execute();
  await db.schema.createIndex("idx_tenant_branch_payments_branch").on("tenant_branch_payments").column("branchId").execute();
  await db.schema.createIndex("idx_tenant_branch_payments_tenant").on("tenant_branch_payments").column("tenantId").execute();
  await db.schema.createIndex("idx_tenant_branch_payments_branch_status").on("tenant_branch_payments").columns(["branchId", "status"]).execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("idx_tenant_branch_payments_branch_status").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_branch_payments_tenant").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_branch_payments_branch").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_branch_payments_status").ifExists().execute();

  //Drop table
  await db.schema.dropTable("tenant_branch_payments").ifExists().execute();
}
