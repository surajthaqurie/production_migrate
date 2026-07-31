import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("stock_issue_items")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
    .addColumn("stockIssueId", "uuid", (col) => col.references("stock_issues.id").notNull().onDelete("restrict"))

    .addColumn("ratePerItem", "double precision", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("totalPrice", "double precision", (col) => col.notNull().defaultTo(0))

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addUniqueConstraint("unique_stock_issue_product", ["productId", "stockIssueId"])

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("stock_issue_items_idx").on("stock_issue_items").column("stockIssueId").execute();
  await db.schema.createIndex("stock_issue_items_product_idx").on("stock_issue_items").column("productId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("stock_issue_items_idx").execute();
  await db.schema.dropIndex("stock_issue_items_product_idx").execute();

  //Drop table
  await db.schema.dropTable("stock_issue_items").ifExists().execute();
}
