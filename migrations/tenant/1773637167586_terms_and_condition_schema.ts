import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("system_terms_and_conditions")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("title", "varchar(100)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull())

    .addColumn("type", "varchar(20)", (col) => col.notNull())
    .addColumn("content", "text", (col) => col.notNull())

    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
    .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addUniqueConstraint("unique_terms_conditions_branch_type_slug", ["branchId", "slug", "type"])

    .execute();

  await db.schema.createIndex("system_terms_and_conditions_branchId_idx").on("system_terms_and_conditions").column("branchId").execute();
  await db.schema.createIndex("system_terms_and_conditions_type_idx").on("system_terms_and_conditions").column("type").execute();
  await db.schema.createIndex("system_terms_and_conditions_title_idx").on("system_terms_and_conditions").column("title").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("system_terms_and_conditions_branchId_idx").ifExists().execute();
  await db.schema.dropIndex("system_terms_and_conditions_type_idx").ifExists().execute();
  await db.schema.dropIndex("system_terms_and_conditions_title_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("system_terms_and_conditions").ifExists().execute();
}
