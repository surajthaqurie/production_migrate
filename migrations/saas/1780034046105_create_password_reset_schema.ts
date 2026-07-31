import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("password_resets")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("adminId", "uuid", (col) => col.notNull().references("admins.id").onDelete("cascade"))
    .addColumn("token", "varchar(255)", (col) => col.notNull().unique())

    .addColumn("expiresAt", "timestamptz", (col) => col.notNull())
    .addColumn("expired", "boolean", (col) => col.notNull().defaultTo(false))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema.createIndex("password_resets_token_idx").on("password_resets").column("token").execute();
  await db.schema.createIndex("password_resets_adminId_idx").on("password_resets").column("adminId").execute();
  await db.schema.createIndex("password_resets_expiresAt_idx").on("password_resets").column("expiresAt").execute();
  await db.schema.createIndex("password_resets_adminId_expired_idx").on("password_resets").columns(["adminId", "expired"]).execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("password_resets_adminId_expired_idx").execute();
  await db.schema.dropIndex("password_resets_expiresAt_idx").execute();
  await db.schema.dropIndex("password_resets_adminId_idx").execute();
  await db.schema.dropIndex("password_resets_token_idx").execute();

  //Drop Database
  await db.schema.dropTable("password_resets").ifExists().execute();
}
