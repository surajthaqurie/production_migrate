import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("tenant_payment_documents")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
    .addColumn("paymentId", "uuid", (col) => col.notNull().references("tenant_payments.id").onDelete("cascade"))
    .addColumn("fileId", "uuid", (col) => col.notNull().references("system_files.id").onDelete("restrict"))

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("idx_tenant_payment_documents_payment").on("tenant_payment_documents").column("paymentId").execute();
  await db.schema.createIndex("idx_tenant_payment_documents_tenant").on("tenant_payment_documents").column("tenantId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("idx_tenant_payment_documents_name").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_payment_documents_tenant").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_payment_documents_payment").ifExists().execute();

  await db.schema.dropTable("tenant_payment_documents").ifExists().execute();
}
