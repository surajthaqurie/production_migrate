import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("stock_in_transit")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
    .addColumn("code", "varchar(18)", (col) => col.notNull().unique())

    .addColumn("status", sql`material_transit_status`, (col) => col.notNull().defaultTo(sql`'IN_TRANSIT'`))
    .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))

    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
    .addColumn("stockIssueId", "uuid", (col) => col.references("stock_issues.id").onDelete("restrict"))
    .addColumn("requisitionId", "uuid", (col) => col.references("material_requisitions.id").onDelete("restrict"))

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("voidedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("voidedAt", "timestamptz")
    .addColumn("voidReason", "text")

    .addColumn("settledBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("settledAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("stock_in_transit_stock_issue_idx").on("stock_in_transit").column("stockIssueId").execute();
  await db.schema.createIndex("stock_in_transit_requisition_idx").on("stock_in_transit").column("requisitionId").execute();
  await db.schema.createIndex("stock_in_transit_fiscalYear_idx").on("stock_in_transit").column("fiscalYear").execute();
  await db.schema.createIndex("stock_in_transit_branch_idx").on("stock_in_transit").column("branchId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("stock_in_transit_stock_issue_idx").execute();
  await db.schema.dropIndex("stock_in_transit_requisition_idx").execute();
  await db.schema.dropIndex("stock_in_transit_fiscalYear_idx").execute();
  await db.schema.dropIndex("stock_in_transit_branch_idx").execute();

  //Drop table
  await db.schema.dropTable("stock_in_transit").ifExists().execute();
}
