import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("general_configs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("baseDomain", "text", (col) => col.notNull().unique())
    .addColumn("trailDays", "integer", (col) => col.notNull())
    .addColumn("trialExtendDays", "integer", (col) => col.notNull())
    .addColumn("ecommercePrefix", "varchar(100)", (col) => col.notNull())
    .addColumn("tenantPrefix", "varchar(100)", (col) => col.notNull())
    .addColumn("branchPrice", "double precision", (col) => col.notNull())
    .addColumn("gracePeriod", "integer", (col) => col.notNull())

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
    .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("general_configs").execute();
}
