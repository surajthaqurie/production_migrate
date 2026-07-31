import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("system_addons")

    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull().unique())

    .addColumn("description", "text")

    // Catalog feature this addon grants extra capacity for (e.g. OCR Scan)
    .addColumn("featureId", "uuid", (col) => col.notNull().references("system_plan_features.id").onDelete("restrict"))

    .addColumn("perPrice", "double precision", (col) => col.notNull())
    .addColumn("currency", "varchar(3)", (col) => col.notNull().defaultTo("NPR"))

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
    .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))

    .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("idx_system_addons_feature").on("system_addons").column("featureId").execute();
  await db.schema.createIndex("idx_system_addons_is_deleted").on("system_addons").column("isDeleted").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("idx_system_addons_is_deleted").ifExists().execute();
  await db.schema.dropIndex("idx_system_addons_feature").ifExists().execute();

  //Drop table
  await db.schema.dropTable("system_addons").ifExists().execute();
}
