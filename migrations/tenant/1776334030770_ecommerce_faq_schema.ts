import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("ecommerce_faqs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("tenantId", "uuid", (col) => col.references("companies.id").onDelete("cascade").notNull())

    .addColumn("question", "text", (col) => col.notNull())
    .addColumn("questionSlug", "text", (col) => col.notNull())
    .addColumn("answer", "text", (col) => col.notNull())

    .addColumn("sortOrder", "integer", (col) => col.notNull().defaultTo(0))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .addUniqueConstraint("unique_ecommerce_faqs_tenant_question", ["tenantId", "questionSlug"])

    .execute();

  await db.schema.createIndex("ecommerce_faqs_tenant_idx").on("ecommerce_faqs").column("tenantId").execute();
  await db.schema.createIndex("ecommerce_faqs_sort_order_idx").on("ecommerce_faqs").column("sortOrder").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("ecommerce_faqs_sort_order_idx").on("ecommerce_faqs").execute();
  await db.schema.dropIndex("ecommerce_faqs_tenant_idx").on("ecommerce_faqs").execute();

  // drop table
  await db.schema.dropTable("ecommerce_faqs").ifExists().execute();
}
