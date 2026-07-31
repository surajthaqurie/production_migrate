import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("people_companies")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("personId", "uuid", (col) => col.notNull().references("people_management.id").onDelete("cascade"))
    .addColumn("name", "varchar(100)", (col) => col.notNull())
    .addColumn("position", "varchar(50)", (col) => col.notNull())

    .addColumn("employeeCount", "integer")
    .addColumn("businessType", "varchar(50)")
    .addColumn("websiteURL", "text")

    .addColumn("location", "varchar(255)")
    .addColumn("state", "varchar(255)")
    .addColumn("city", "varchar(255)")
    .addColumn("zipCode", "varchar(20)")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  // Indexes
  await db.schema.createIndex("idx_people_companies_person_id").on("people_companies").column("personId").execute();
  await db.schema.createIndex("idx_people_companies_business_type").on("people_companies").column("businessType").execute();
  await db.schema.createIndex("idx_people_companies_created_at").on("people_companies").column("createdAt").execute();
  await db.schema.createIndex("idx_people_companies_name").on("people_companies").column("name").execute();
  await db.schema.createIndex("idx_people_companies_state").on("people_companies").column("state").execute();
  await db.schema.createIndex("idx_people_companies_city").on("people_companies").column("city").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("idx_people_companies_city").ifExists().execute();
  await db.schema.dropIndex("idx_people_companies_state").ifExists().execute();
  await db.schema.dropIndex("idx_people_companies_name").ifExists().execute();
  await db.schema.dropIndex("idx_people_companies_created_at").ifExists().execute();
  await db.schema.dropIndex("idx_people_companies_business_type").ifExists().execute();
  await db.schema.dropIndex("idx_people_companies_person_id").ifExists().execute();

  //DROP TABLE
  await db.schema.dropTable("people_companies").ifExists().execute();
}
