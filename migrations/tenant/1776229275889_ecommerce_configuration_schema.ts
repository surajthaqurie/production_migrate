import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("ecommerce_configs")
    .addColumn("tenantId", "uuid", (col) => col.primaryKey().references("companies.id").onDelete("cascade"))

    .addColumn("domain", "varchar", (col) => col.notNull().unique())

    .addColumn("metadata", "json")
    // .addColumn("theme", "varchar", (col) => col.notNull().defaultTo("default"))
    // .addColumn("layout", "varchar", (col) => col.defaultTo("modern"))
    // .addColumn("font_family", "varchar", (col) => col.notNull().defaultTo("inter"))
    // .addColumn("show_banner", "boolean", (col) => col.notNull().defaultTo(true))
    // .addColumn("show_search", "boolean", (col) => col.notNull().defaultTo(true))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("enabled", "boolean", (col) => col.notNull().defaultTo(true))
    .addColumn("enabledBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("enabledAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("ecommerce_configs_enabled_idx").on("ecommerce_configs").column("enabled").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("ecommerce_configs_enabled_idx").on("ecommerce_configs").execute();

  //Drop table
  await db.schema.dropTable("ecommerce_configs").ifExists().execute();
}
