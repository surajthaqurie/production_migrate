import { sql, type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("material_requisition_receipt")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
    .addColumn("requisitionId", "uuid", (col) => col.references("material_requisitions.id").notNull().onDelete("restrict"))

    .addColumn("ratePerItem", "double precision", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("totalPrice", "double precision", (col) => col.notNull().defaultTo(0))

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addUniqueConstraint("unique_requisition_product_receipt", ["productId", "requisitionId"])

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("material_requisition_receipt_idx").on("material_requisition_receipt").column("requisitionId").execute();
  await db.schema.createIndex("material_requisition_receipt_product_idx").on("material_requisition_receipt").column("productId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("material_requisition_receipt_idx").execute();
  await db.schema.dropIndex("material_requisition_receipt_product_idx").execute();

  //Drop table
  await db.schema.dropTable("material_requisition_receipt").ifExists().execute();
}
