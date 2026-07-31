import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("fiscal_year_status")
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
    .addColumn("previousFiscalYear", "varchar(7)")

    .addColumn("isLocked", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("lockedDate", "timestamptz")
    .addColumn("lockedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))

    .addColumn("isTransferred", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("transferDate", "timestamptz")
    .addColumn("transferBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))

    .addColumn("isInventoryTransferred", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("isSupplierTransferred", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("isCustomerTransferred", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("isTransitTransferred", "boolean", (col) => col.notNull().defaultTo(false))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addUniqueConstraint("unique_fiscal_year_branch", ["fiscalYear", "branchId"])

    .execute();

  await db.schema.createIndex("fiscal_year_status_branch_idx").on("fiscal_year_status").column("branchId").execute();
  await db.schema.createIndex("fiscal_year_status_createdBy_idx").on("fiscal_year_status").column("createdBy").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("fiscal_year_status_branch_idx").execute();
  await db.schema.dropIndex("fiscal_year_status_createdBy_idx").execute();

  //Drop table
  await db.schema.dropTable("fiscal_year_status").ifExists().execute();
}
