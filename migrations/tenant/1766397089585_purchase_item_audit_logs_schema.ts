import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("purchase_item_audit_logs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("resourceType", "varchar(100)", (col) => col.notNull()) // Examples: 'PurchaseBillItem', 'PurchaseOrderItem', 'GrnItem', 'DebitNoteItem'
    .addColumn("resourceId", "uuid", (col) => col.notNull()) // The actual item row ID

    .addColumn("parentResourceType", "varchar(100)", (col) => col.notNull()) // Examples: 'PurchaseBill', 'PurchaseOrder', 'PurchaseGrn'
    .addColumn("parentResourceId", "uuid", (col) => col.notNull())

    .addColumn("previousLogs", "jsonb")
    .addColumn("currentLogs", "jsonb", (col) => col.notNull())

    .addColumn("event", "text", (col) => col.notNull())
    .addColumn("remark", "text")

    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").onDelete("restrict").notNull())

    .addColumn("description", "text")
    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();

  await db.schema.createIndex("purchase_item_audit_logs_resource_idx").on("purchase_item_audit_logs").columns(["resourceType", "resourceId"]).execute();
  await db.schema.createIndex("purchase_item_audit_logs_parent_idx").on("purchase_item_audit_logs").columns(["parentResourceType", "parentResourceId"]).execute();
  await db.schema.createIndex("purchase_item_audit_logs_branch_idx").on("purchase_item_audit_logs").column("branchId").execute();
  await db.schema.createIndex("purchase_item_audit_logs_event_idx").on("purchase_item_audit_logs").column("event").execute();
  await db.schema.createIndex("purchase_item_audit_logs_createdAt_idx").on("purchase_item_audit_logs").column("createdAt desc").execute();
  await db.schema.createIndex("purchase_item_audit_logs_branch_fiscal_idx").on("purchase_item_audit_logs").columns(["branchId", "fiscalYear", "createdAt desc"]).execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("purchase_item_audit_logs_resource_idx").ifExists().execute();
  await db.schema.dropIndex("purchase_item_audit_logs_parent_idx").ifExists().execute();
  await db.schema.dropIndex("purchase_item_audit_logs_branch_idx").ifExists().execute();
  await db.schema.dropIndex("purchase_item_audit_logs_event_idx").ifExists().execute();
  await db.schema.dropIndex("purchase_item_audit_logs_createdAt_idx").ifExists().execute();
  await db.schema.dropIndex("purchase_item_audit_logs_branch_fiscal_idx").ifExists().execute();

  // Drop table
  await db.schema.dropTable("purchase_item_audit_logs").ifExists().cascade().execute();
}
