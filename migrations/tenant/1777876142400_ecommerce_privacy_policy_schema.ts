import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("ecommerce_privacy_policy")
    .addColumn("tenantId", "uuid", (col) => col.primaryKey().references("companies.id").onDelete("cascade"))
    .addColumn("content", "text", (col) => col.notNull().defaultTo(""))
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema.createIndex("ecommerce_privacy_policy_createdBy_idx").on("ecommerce_privacy_policy").column("createdBy").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("ecommerce_privacy_policy_createdBy_idx").on("ecommerce_privacy_policy").execute();

  // Drop table
  await db.schema.dropTable("ecommerce_privacy_policy").ifExists().execute();
}
