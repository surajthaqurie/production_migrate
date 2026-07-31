import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("sales_settlements")
    .addColumn("billId", "uuid", (col) => col.primaryKey().references("sales_order_bills.id").onDelete("restrict").notNull())
    .addColumn("code", "varchar(20)", (col) => col.notNull())
    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull()) // Format: "2080/81"
    .addColumn("amount", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))

    .addColumn("metadata", "jsonb")
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("sales_settlements").ifExists().execute();
}
