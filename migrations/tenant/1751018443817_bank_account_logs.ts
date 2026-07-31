import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("bank_account_logs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("bankAccountId", "uuid", (col) => col.references("bank_accounts.id").notNull().onDelete("cascade"))
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

  await db.schema.createIndex("bank_log_bank_idx").on("bank_account_logs").column("bankAccountId").execute();
  await db.schema.createIndex("bank_log_branch_idx").on("bank_account_logs").column("branchId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("bank_log_bank_idx").execute();
  await db.schema.dropIndex("bank_log_branch_idx").execute();

  //Drop table
  await db.schema.dropTable("bank_account_logs").ifExists().execute();
}
