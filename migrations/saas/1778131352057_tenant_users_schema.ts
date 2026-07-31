import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("tenants_users")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("email", "varchar(255)", (col) => col.notNull().unique())

    .addColumn("password", "varchar(255)", (col) => col.notNull())
    .addColumn("displayName", "varchar(255)", (col) => col.notNull())
    .addColumn("contactNumber", "varchar(255)", (col) => col.notNull().unique())

    .addColumn("avatar", "varchar(255)")
    .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))

    .addColumn("online", "boolean", (col) => col.defaultTo(false))
    .addColumn("lastOnline", "timestamptz")

    .addColumn("loginAttempts", "integer", (col) => col.defaultTo(0))
    .addColumn("isSuspended", "boolean", (col) => col.defaultTo(false))
    .addColumn("suspendedFor", "timestamptz")

    .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("restrict"))

    // .addColumn("createdBy", "uuid", (col) => col.notNull().references("tenants_users.id").onDelete("restrict"))
    // .addColumn("deletedBy", "uuid", (col) => col.references("tenants_users.id").onDelete("set null"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("tenants_users_displayName_idx").on("tenants_users").column("displayName").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("tenants_users_displayName_idx").execute();

  //Drop table
  await db.schema.dropTable("tenants_users").ifExists().execute();
}
