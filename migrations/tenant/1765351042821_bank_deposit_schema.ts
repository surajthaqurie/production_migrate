import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("bank_deposits")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
    .addColumn("bankId", "uuid", (col) => col.references("bank_accounts.id").notNull().onDelete("restrict"))

    .addColumn("remarks", "text")
    .addColumn("amount", "double precision", (col) => col.notNull().defaultTo(0))

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("bank_deposits_user_idx").on("bank_deposits").column("createdBy").execute();
  await db.schema.createIndex("bank_deposits_branch_idx").on("bank_deposits").column("branchId").execute();
  await db.schema.createIndex("bank_deposits_bank_idx").on("bank_deposits").column("bankId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("bank_deposits_user_idx").execute();
  await db.schema.dropIndex("bank_deposits_branch_idx").execute();
  await db.schema.dropIndex("bank_deposits_bank_idx").execute();

  //Drop table
  await db.schema.dropTable("bank_deposits").ifExists().execute();
}
