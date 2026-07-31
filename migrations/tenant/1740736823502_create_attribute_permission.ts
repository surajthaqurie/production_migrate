import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("attribute_permissions")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("roleId", "uuid", (col) => col.notNull().unique().references("user_roles.id").onDelete("restrict"))

    .addColumn("allowDiscount", "boolean", (col) => col.defaultTo(false))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  // await db.schema.createIndex("attribute_permissions_roleId_idx").on("attribute_permissions").columns(["roleId"]).unique().execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("attribute_permissions").ifExists().execute();
}
