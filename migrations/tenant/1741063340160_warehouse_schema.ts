import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("warehouses")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.unique().notNull())
    .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))

    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))
    // .addColumn("type", sql`warehouse_type`, (col) => col.notNull())

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

  await db.schema.createIndex("warehouses_name_idx").on("warehouses").column("name").execute();
  await db.schema.createIndex("warehouses_primaryPhone_idx").on("warehouses").column("primaryPhone").execute();
  await db.schema.createIndex("warehouses_primaryEmail_idx").on("warehouses").column("primaryEmail").execute();
  await db.schema.createIndex("warehouses_location_idx").on("warehouses").column("location").execute();
  await db.schema.createIndex("warehouses_city_idx").on("warehouses").column("city").execute();
  await db.schema.createIndex("warehouses_state_idx").on("warehouses").column("state").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("warehouses_name_idx").execute();
  await db.schema.dropIndex("warehouses_primaryPhone_idx").execute();
  await db.schema.dropIndex("warehouses_primaryEmail_idx").execute();
  await db.schema.dropIndex("warehouses_location_idx").execute();
  await db.schema.dropIndex("warehouses_city_idx").execute();
  await db.schema.dropIndex("warehouses_state_idx").execute();

  //Drop table
  await db.schema.dropTable("warehouses").ifExists().execute();
}
