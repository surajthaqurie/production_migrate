import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("opening_balance_configs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())

    .addColumn("sourceType", "varchar(10)", (col) => col.notNull()) //Cash | Bank
    .addColumn("sourceDetail", "varchar(255)")

    .addColumn("bankId", "uuid", (col) => col.references("bank_accounts.id").onDelete("set null"))
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))

    .addColumn("openingBalance", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("closingBalance", "double precision", (col) => col.notNull().defaultTo(0))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")
    .execute();

  //  Indexes
  await db.schema.createIndex("opening_balance_configs_fiscal_year_idx").on("opening_balance_configs").column("fiscalYear").execute();
  await db.schema.createIndex("opening_balance_configs_branch_idx").on("opening_balance_configs").column("branchId").execute();
  await db.schema.createIndex("opening_balance_configs_bank_idx").on("opening_balance_configs").column("bankId").execute();
  await db.schema.createIndex("opening_balance_configs_source_type_idx").on("opening_balance_configs").column("sourceType").execute();
  await db.schema.createIndex("opening_balance_configs_branch_year_idx").on("opening_balance_configs").columns(["branchId", "fiscalYear"]).execute();

  // Partial unique index for BANK type: unique (branchId, bankId, fiscalYear) where sourceDetail IS NULL
  await sql`CREATE UNIQUE INDEX opening_balance_unique_branch_bank_year ON opening_balance_configs ("branchId", "bankId", "fiscalYear") WHERE "sourceDetail" IS NULL AND "isDeleted" = false`.execute(
    db
  );

  // Partial unique index for CASH type: unique (branchId, sourceDetail, fiscalYear) where bankId IS NULL
  await sql`CREATE UNIQUE INDEX opening_balance_unique_branch_cash_year ON opening_balance_configs ("branchId", "sourceDetail", "fiscalYear") WHERE "bankId" IS NULL AND "isDeleted" = false`.execute(
    db
  );
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("opening_balance_unique_branch_bank_year").ifExists().execute();
  await db.schema.dropIndex("opening_balance_unique_branch_cash_year").ifExists().execute();
  await db.schema.dropIndex("opening_balance_configs_branch_year_idx").ifExists().execute();
  await db.schema.dropIndex("opening_balance_configs_source_type_idx").ifExists().execute();
  await db.schema.dropIndex("opening_balance_configs_bank_idx").ifExists().execute();
  await db.schema.dropIndex("opening_balance_configs_branch_idx").ifExists().execute();
  await db.schema.dropIndex("opening_balance_configs_fiscal_year_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("opening_balance_configs").ifExists().execute();
}
