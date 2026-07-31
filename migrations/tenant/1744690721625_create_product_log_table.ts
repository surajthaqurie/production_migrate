import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("product_logs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("cascade"))
    .addColumn("previousLogs", "jsonb", (col) => col.notNull())
    .addColumn("currentLogs", "jsonb", (col) => col.notNull())
    .addColumn("event", "text", (col) => col.notNull())
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("remark", "text", (col) => col.notNull())

    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull()) // Format: "2080/81"
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").onDelete("restrict"))

    .addColumn("description", "text")
    .addColumn("metadata", "json")
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  //@Indexing
  await db.schema.createIndex("product_logs_product_idx").on("product_logs").column("productId").execute();
  await db.schema.createIndex("product_logs_branch_idx").on("product_logs").column("branchId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("product_logs_product_idx").execute();
  await db.schema.dropIndex("product_logs_branch_idx").execute();

  //Drop table
  await db.schema.dropTable("product_logs").ifExists().execute();
}
