import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("help_support_configs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("whatsappNumber", "varchar(20)", (col) => col.notNull())
    .addColumn("viberNumber", "varchar(20)", (col) => col.notNull())
    .addColumn("email", "varchar(255)", (col) => col.notNull())
    .addColumn("contactNumber", "varchar(20)", (col) => col.notNull())

    .addColumn("browseDocUrl", "text")
    .addColumn("youtubeUrl", "text")
    .addColumn("resourceUrl", "text")
    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
    .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("help_support_configs").execute();
}
