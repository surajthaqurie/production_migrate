import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("admin_branch_sessions")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("adminId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull()) // For active fiscal year after switching

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addUniqueConstraint("unique_admin_branch_fiscal_year_sessions", ["adminId", "branchId", "fiscalYear"])
    .addUniqueConstraint("unique_admin_branch_sessions", ["adminId", "branchId"])
    .execute();

  await db.schema.createIndex("admin_branch_sessions_idx").on("admin_branch_sessions").columns(["adminId", "branchId"]).unique().execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("admin_branch_sessions_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("admin_branch_sessions").ifExists().execute();
}
