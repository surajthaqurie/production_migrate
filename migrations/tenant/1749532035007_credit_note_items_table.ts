import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("credit_note_items")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
    .addColumn("creditNoteId", "uuid", (col) => col.references("credit_notes.id").notNull().onDelete("restrict"))

    .addColumn("discountValue", "double precision")
    .addColumn("discountType", sql`discount_type`)
    .addColumn("vat", "double precision", (col) => col.defaultTo(0))

    .addColumn("ratePerItem", "double precision", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("totalPrice", "double precision", (col) => col.notNull().defaultTo(0))

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    //Unique the product and order
    .addUniqueConstraint("unique_credit_note_product", ["productId", "creditNoteId"])

    .execute();

  await db.schema.createIndex("credit_note_items_note_idx").on("credit_note_items").column("creditNoteId").execute();
  await db.schema.createIndex("credit_note_items_product_idx").on("credit_note_items").column("productId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("credit_note_items_note_idx").execute();
  await db.schema.dropIndex("credit_note_items_product_idx").execute();

  //Drop table
  await db.schema.dropTable("credit_note_items").ifExists().execute();
}
