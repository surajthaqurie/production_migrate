import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("user_date_format_preferences")
    .addColumn("userId", "uuid", (col) => col.primaryKey().references("admins.id").onDelete("cascade"))
    .addColumn("dateFormat", "varchar(2)", (col) => col.notNull().defaultTo("AD"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("user_date_format_preferences").execute();
}
