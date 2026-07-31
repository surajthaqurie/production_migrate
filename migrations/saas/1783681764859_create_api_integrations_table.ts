import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("api_integrations")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("clientName", "varchar(100)", (col) => col.notNull())
    .addColumn("apiKeyHash", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("clientId", "varchar(255)", (col) => col.unique())
    .addColumn("clientSecretHash", "varchar(255)")

    .addColumn("tenantId", "uuid", (col) => col.notNull())
    .addColumn("branchId", "uuid", (col) => col.notNull())

    .addColumn("fiscalYear", "varchar(20)", (col) => col.notNull())
    .addColumn("bypassFyLock", "boolean", (col) => col.defaultTo(false).notNull())
    .addColumn("isActive", "boolean", (col) => col.defaultTo(true).notNull())
    .addColumn("allowedIps", "text")

    .addColumn("tier", "varchar(50)", (col) => col.defaultTo("free").notNull())
    .addColumn("webhookUrl", "varchar(255)")
    .addColumn("webhookSecret", "varchar(255)")
    .addColumn("webhookEvents", "text")

    // References to the Master DB tenants_users table since tenant admins map to these master records
    .addColumn("createdBy", "uuid", (col) => col.notNull().references("tenants_users.id").onDelete("restrict"))
    .addColumn("updatedBy", "uuid", (col) => col.references("tenants_users.id").onDelete("set null"))
    .addColumn("disabledBy", "uuid", (col) => col.references("tenants_users.id").onDelete("set null"))
    .addColumn("disabledAt", "timestamptz")

    .addColumn("deletedBy", "uuid", (col) => col.references("tenants_users.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();

  await db.schema.createIndex("api_integrations_apiKeyHash_idx").on("api_integrations").column("apiKeyHash").execute();
  await db.schema.createIndex("api_integrations_clientId_idx").on("api_integrations").column("clientId").execute();
  await db.schema.createIndex("api_integrations_tenantId_idx").on("api_integrations").column("tenantId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("api_integrations_tenantId_idx").ifExists().execute();
  await db.schema.dropIndex("api_integrations_clientId_idx").ifExists().execute();
  await db.schema.dropIndex("api_integrations_apiKeyHash_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("api_integrations").ifExists().execute();
}
