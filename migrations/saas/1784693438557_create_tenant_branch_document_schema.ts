import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("tenant_branch_documents")

    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("tags", sql`text[]`, (col) => col.defaultTo(sql`'{}'`))

    .addColumn("branchId", "uuid", (col) => col.references("tenant_branches.id").notNull().onDelete("cascade"))
    .addColumn("fileId", "uuid", (col) => col.notNull().references("system_files.id").onDelete("restrict"))

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("tenant_branch_documents_branch_idx").on("tenant_branch_documents").column("branchId").execute();
  await db.schema.createIndex("tenant_branch_documents_name_idx").on("tenant_branch_documents").column("name").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("tenant_branch_documents_branch_idx").ifExists().execute();
  await db.schema.dropIndex("tenant_branch_documents_name_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("tenant_branch_documents").ifExists().execute();
}
