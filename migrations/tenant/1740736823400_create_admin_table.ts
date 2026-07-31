import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("admins")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("displayName", "varchar(255)", (col) => col.notNull())
    .addColumn("username", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("email", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("password", "varchar(255)", (col) => col.notNull())
    .addColumn("contactNumber", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("roleId", "uuid", (col) => col.notNull().references("user_roles.id").onDelete("restrict"))

    .addColumn("avatar", "varchar(255)")

    .addColumn("online", "boolean", (col) => col.defaultTo(false))
    .addColumn("lastOnline", "timestamptz")

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))

    .addColumn("loginAttempts", "integer", (col) => col.defaultTo(0))
    .addColumn("isSuspended", "boolean", (col) => col.defaultTo(false))
    .addColumn("suspendedFor", "timestamptz")

    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("metadata", "json")
    .addColumn("language", "varchar(10)", (col) => col.defaultTo("en"))

    .addColumn("location", "varchar(255)")
    .addColumn("city", "varchar(255)")
    .addColumn("state", "varchar(255)")
    .addColumn("zipCode", "varchar(20)")

    .addColumn("bankVisit", "boolean", (col) => col.defaultTo(false))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("admins_displayName_idx").on("admins").column("displayName").execute();
  await db.schema.createIndex("admins_location_idx").on("admins").column("location").execute();
  await db.schema.createIndex("admins_city_idx").on("admins").column("city").execute();
  await db.schema.createIndex("admins_state_idx").on("admins").column("state").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("admins_displayName_idx").execute();
  await db.schema.dropIndex("admins_location_idx").execute();
  await db.schema.dropIndex("admins_city_idx").execute();
  await db.schema.dropIndex("admins_state_idx").execute();

  //Drop table
  await db.schema.dropTable("admins").ifExists().execute();
}
