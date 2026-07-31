import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("customer_logs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("customerId", "uuid", (col) => col.references("customers.id").notNull().onDelete("cascade"))
    .addColumn("previousLogs", "jsonb", (col) => col.notNull())
    .addColumn("currentLogs", "jsonb", (col) => col.notNull())
    .addColumn("event", "text", (col) => col.notNull())
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("remark", "text", (col) => col.notNull())

    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").onDelete("restrict"))

    .addColumn("description", "text")
    .addColumn("metadata", "json")
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("customer_log_customer_idx").on("customer_logs").column("customerId").execute();
  await db.schema.createIndex("customer_log_branch_idx").on("customer_logs").column("branchId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("customer_log_customer_idx").execute();
  await db.schema.dropIndex("customer_log_branch_idx").execute();

  //Drop table
  await db.schema.dropTable("customer_logs").ifExists().execute();
}
