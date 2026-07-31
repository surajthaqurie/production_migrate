import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("cash_adjustments")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
    .addColumn("refNo", "varchar(100)")

    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("type", "varchar(10)", (col) => col.notNull()) // "EXPENSE" | "INCOME"
    .addColumn("amount", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("description", "text")
    .addColumn("fileId", "uuid", (col) => col.references("system_files.id").onDelete("restrict"))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    // Soft delete fields
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false).notNull())
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .execute();

  await db.schema.createIndex("cash_adjustments_branch_idx").on("cash_adjustments").column("branchId").execute();
  await db.schema.createIndex("cash_adjustments_fiscal_idx").on("cash_adjustments").column("fiscalYear").execute();
  await db.schema.createIndex("cash_adjustments_branch_fiscal_idx").on("cash_adjustments").columns(["branchId", "fiscalYear"]).execute();
  await db.schema.createIndex("cash_adjustments_branch_creator_idx").on("cash_adjustments").column("createdBy").execute();
  await db.schema.createIndex("cash_adjustments_file_idx").on("cash_adjustments").column("fileId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("cash_adjustments_branch_idx").execute();
  await db.schema.dropIndex("cash_adjustments_fiscal_idx").execute();
  await db.schema.dropIndex("cash_adjustments_branch_fiscal_idx").execute();
  await db.schema.dropIndex("cash_adjustments_branch_creator_idx").execute();
  await db.schema.dropIndex("cash_adjustments_file_idx").execute();

  //Drop table
  await db.schema.dropTable("cash_adjustments").ifExists().execute();
}
