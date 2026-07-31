import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("tenant_people")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("restrict"))
    .addColumn("personId", "uuid", (col) => col.notNull().unique().references("people_management.id").onDelete("restrict"))
    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();

  await db.schema.createIndex("tenant_people_tenant_idx").on("tenant_people").column("tenantId").execute();
  await db.schema.createIndex("tenant_people_creator_idx").on("tenant_people").column("createdBy").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("tenant_people_tenant_idx").ifExists().execute();
  await db.schema.dropIndex("tenant_people_creator_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("tenant_people").execute();
}
