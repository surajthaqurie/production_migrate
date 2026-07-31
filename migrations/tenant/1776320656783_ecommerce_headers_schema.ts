import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("ecommerce_headers")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("tenantId", "uuid", (col) => col.references("companies.id").onDelete("cascade"))
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("contentSlug", "text", (col) => col.notNull())
    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema.createIndex("ecommerce_headers_tenantId_idx").on("ecommerce_headers").column("tenantId").execute();
  await db.schema.createIndex("ecommerce_headers_createdBy_idx").on("ecommerce_headers").column("createdBy").execute();
  await db.schema.createIndex("ecommerce_headers_createdAt_idx").on("ecommerce_headers").column("createdAt").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("ecommerce_headers_createdAt_idx").on("ecommerce_headers").execute();
  await db.schema.dropIndex("ecommerce_headers_createdBy_idx").on("ecommerce_headers").execute();
  await db.schema.dropIndex("ecommerce_headers_tenantId_idx").on("ecommerce_headers").execute();

  //Drop table
  await db.schema.dropTable("ecommerce_headers").ifExists().execute();
}
