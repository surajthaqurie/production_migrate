import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("companies")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.unique().notNull())
    .addColumn("logo", "text", (col) => col.notNull())

    .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))

    .addColumn("location", "varchar(255)", (col) => col.notNull())
    .addColumn("city", "varchar(255)", (col) => col.notNull())
    .addColumn("state", "varchar(255)", (col) => col.notNull())
    .addColumn("zipCode", "varchar(20)")
    .addColumn("primaryPhone", "varchar(20)", (col) => col.notNull())

    .addColumn("primaryContractPerson", "varchar(255)")
    .addColumn("primaryEmail", "varchar(255)")

    .addColumn("vatNo", "varchar(20)")
    .addColumn("panNo", "varchar(20)")

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("companies_name_idx").on("companies").column("name").execute();
  await db.schema.createIndex("companies_primaryPhone_idx").on("companies").column("primaryPhone").execute();
  await db.schema.createIndex("companies_panNo_idx").on("companies").column("panNo").execute();
  await db.schema.createIndex("companies_vatNo_idx").on("companies").column("vatNo").execute();
  await db.schema.createIndex("companies_location_idx").on("companies").column("location").execute();
  await db.schema.createIndex("companies_city_idx").on("companies").column("city").execute();
  await db.schema.createIndex("companies_state_idx").on("companies").column("state").execute();
  await db.schema.createIndex("companies_zipCode_idx").on("companies").column("zipCode").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("companies_name_idx").execute();
  await db.schema.dropIndex("companies_primaryPhone_idx").execute();
  await db.schema.dropIndex("companies_panNo_idx").execute();
  await db.schema.dropIndex("companies_vatNo_idx").execute();
  await db.schema.dropIndex("companies_location_idx").execute();
  await db.schema.dropIndex("companies_city_idx").execute();
  await db.schema.dropIndex("companies_state_idx").execute();
  await db.schema.dropIndex("companies_zipCode_idx").execute();

  //Drop table
  await db.schema.dropTable("companies").ifExists().execute();
}
