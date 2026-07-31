import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("permission_sets")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    // .addColumn("group", "varchar(100)", (col) => col.notNull())
    .addColumn("resource", "varchar", (col) => col.notNull())
    .addColumn("roleId", "uuid", (col) => col.notNull().references("user_roles.id").onDelete("restrict"))
    .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))
    .addColumn("actions", sql`text[]`, (col) => col.notNull().defaultTo(sql`'{}'`))

    .addColumn("metadata", "json")
    .addColumn("description", "text")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  // Composite index on (resource, roleId)
  await db.schema.createIndex("permission_sets_resource_roleId_idx").on("permission_sets").columns(["resource", "roleId"]).unique().execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("permission_sets_resource_role_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("permission_sets").ifExists().execute();
}
