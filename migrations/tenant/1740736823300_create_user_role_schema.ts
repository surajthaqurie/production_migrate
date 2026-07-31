import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("user_roles")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("slug", "text", (col) => col.notNull())
    .addColumn("name", "varchar(50)", (col) => col.notNull())

    .addColumn("branchId", "uuid")
    .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))

    .addColumn("metadata", "json")
    .addColumn("description", "text")

    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    // Composite unique constraint
    .addUniqueConstraint("user_roles_slug_branch_unique", ["slug", "branchId"])

    .execute();

  await db.schema.createIndex("user_roles_name_idx").on("user_roles").column("name").execute();
  await db.schema.createIndex("user_roles_branch_idx").on("user_roles").column("branchId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("user_roles_name_idx").execute();
  await db.schema.dropIndex("user_roles_branch_idx").execute();

  //Drop table
  await db.schema.dropTable("user_roles").ifExists().execute();
}
