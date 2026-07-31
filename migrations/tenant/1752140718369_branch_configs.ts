import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("branch_configs")
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().unique().onDelete("restrict"))

    .addColumn("pendingPurchaseOrder", "boolean", (col) => col.defaultTo(false))
    .addColumn("pendingPurchaseBill", "boolean", (col) => col.defaultTo(false))
    .addColumn("pendingGrn", "boolean", (col) => col.defaultTo(false))

    .addColumn("pendingAdjustment", "boolean", (col) => col.defaultTo(false))

    .addColumn("pendingDebitNote", "boolean", (col) => col.defaultTo(false))
    .addColumn("pendingCreditNote", "boolean", (col) => col.defaultTo(false))

    .addColumn("pendingSalesOrder", "boolean", (col) => col.defaultTo(false))
    .addColumn("pendingSalesInvoice", "boolean", (col) => col.defaultTo(false))

    .addColumn("pendingStockIssue", "boolean", (col) => col.defaultTo(false))

    .addColumn("metadata", "json")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("branch_configs").ifExists().execute();
}
