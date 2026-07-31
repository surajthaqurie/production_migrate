import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("branches")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.unique().notNull())
    .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))
    .addColumn("companyId", "uuid", (col) => col.references("companies.id").notNull().onDelete("restrict"))

    .addColumn("location", "varchar(255)", (col) => col.notNull())
    .addColumn("city", "varchar(255)", (col) => col.notNull())
    .addColumn("state", "varchar(255)", (col) => col.notNull())
    .addColumn("zipCode", "varchar(20)")
    .addColumn("primaryPhone", "varchar(20)", (col) => col.notNull())

    .addColumn("primaryContractPerson", "varchar(255)")
    .addColumn("primaryEmail", "varchar(255)")

    .addColumn("metadata", "json")
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("branches_name_idx").on("branches").column("name").execute();
  await db.schema.createIndex("branches_primaryPhone_idx").on("branches").column("primaryPhone").execute();
  await db.schema.createIndex("branches_location_idx").on("branches").column("location").execute();
  await db.schema.createIndex("branches_city_idx").on("branches").column("city").execute();
  await db.schema.createIndex("branches_state_idx").on("branches").column("state").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("branches_name_idx").execute();
  await db.schema.dropIndex("branches_primaryPhone_idx").execute();
  await db.schema.dropIndex("branches_location_idx").execute();
  await db.schema.dropIndex("branches_city_idx").execute();
  await db.schema.dropIndex("branches_state_idx").execute();

  //Drop table
  await db.schema.dropTable("branches").ifExists().execute();
}
