import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("purchase_audit_logs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("resourceType", "varchar", (col) => col.notNull())
    .addColumn("resourceId", "uuid", (col) => col.notNull())

    .addColumn("previousLogs", "jsonb", (col) => col.notNull())
    .addColumn("currentLogs", "jsonb", (col) => col.notNull())

    .addColumn("event", "text", (col) => col.notNull())
    .addColumn("remark", "text", (col) => col.notNull())

    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").onDelete("restrict"))

    .addColumn("description", "text")
    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();

  // Optimized indexes
  await db.schema.createIndex("purchase_audit_logs_resource_idx").on("purchase_audit_logs").columns(["resourceType", "resourceId"]).execute();
  await db.schema.createIndex("purchase_audit_logs_branch_idx").on("purchase_audit_logs").column("branchId").execute();
  await db.schema.createIndex("purchase_audit_logs_event_idx").on("purchase_audit_logs").column("event").execute();
  await db.schema.createIndex("purchase_audit_logs_createdAt_idx").on("purchase_audit_logs").column("createdAt").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("purchase_audit_logs_resource_idx").execute();
  await db.schema.dropIndex("purchase_audit_logs_branch_idx").execute();
  await db.schema.dropIndex("purchase_audit_logs_event_idx").execute();
  await db.schema.dropIndex("purchase_audit_logs_createdAt_idx").execute();

  // Drop table
  await db.schema.dropTable("purchase_audit_logs").ifExists().execute();
}
