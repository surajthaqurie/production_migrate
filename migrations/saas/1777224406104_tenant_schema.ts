import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("tenants")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull().unique())

    .addColumn("databaseName", "varchar(100)", (col) => col.notNull().unique())

    .addColumn("tenantDomain", "text", (col) => col.notNull().unique())
    .addColumn("ecommerceDomain", "text", (col) => col.unique())

    .addColumn("status", "varchar(50)", (col) => col.defaultTo("PENDING").notNull())

    .addColumn("isDefault", "boolean", (col) => col.defaultTo(false).notNull())

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))

    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false).notNull())

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();

  await db.schema.createIndex("tenants_name_idx").on("tenants").column("name").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("tenants_name_idx").ifExists().execute();

  // Then drop table
  await db.schema.dropTable("tenants").execute();
}
