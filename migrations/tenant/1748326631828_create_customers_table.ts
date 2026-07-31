import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("customers")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("code", "varchar(15)", (col) => col.notNull().unique())
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.unique().notNull())

    .addColumn("phoneNumber", "varchar(20)", (col) => col.notNull())
    .addColumn("email", "varchar(255)", (col) => col.notNull())

    .addColumn("creditLimit", "numeric")
    .addColumn("landLineNumber", "varchar(9)")
    .addColumn("location", "varchar(255)")
    .addColumn("metadata", "json")
    .addColumn("note", "varchar")

    .addColumn("panNo", "varchar(20)")
    .addColumn("creditTermsId", "uuid", (col) => col.references("credit_terms.id").onDelete("set null"))
    .addColumn("customerTypeId", "uuid", (col) => col.references("customer_types.id").onDelete("set null"))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("customers_name_idx").on("customers").column("name").execute();
  await db.schema.createIndex("customers_phoneNumber_idx").on("customers").column("phoneNumber").execute();
  await db.schema.createIndex("customers_email_idx").on("customers").column("email").execute();
  await db.schema.createIndex("customers_location_idx").on("customers").column("location").execute();
  await db.schema.createIndex("customers_landLineNumber_idx").on("customers").column("landLineNumber").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("customers_name_idx").execute();
  await db.schema.dropIndex("customers_phoneNumber_idx").execute();
  await db.schema.dropIndex("customers_email_idx").execute();
  await db.schema.dropIndex("customers_location_idx").execute();
  await db.schema.dropIndex("customers_landLineNumber_idx").execute();

  //Drop table
  await db.schema.dropTable("customers").ifExists().execute();
}
