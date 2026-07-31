import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("ecommerce_mission_vision")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("tenantId", "uuid", (col) => col.notNull().references("companies.id").onDelete("cascade"))

    .addColumn("title", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .addUniqueConstraint("unique_ecommerce_mission_vision_tenant_slug", ["tenantId", "slug"])

    .execute();

  await db.schema.createIndex("ecommerce_mission_vision_tenant_idx").on("ecommerce_mission_vision").column("tenantId").execute();
  await db.schema.createIndex("ecommerce_mission_vision_slug_idx").on("ecommerce_mission_vision").column("slug").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("ecommerce_mission_vision_slug_idx").ifExists().execute();
  await db.schema.dropIndex("ecommerce_mission_vision_tenant_idx").ifExists().execute();

  // Drop table
  await db.schema.dropTable("ecommerce_mission_vision").ifExists().execute();
}
