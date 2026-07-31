import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("sales_orders")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("code", "varchar(18)", (col) => col.notNull())
    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
    .addColumn("refNo", "varchar(100)")
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))

    .addColumn("warehouseId", "uuid", (col) => col.references("warehouses.id").onDelete("restrict"))
    .addColumn("status", sql`order_grn_status`, (col) => col.notNull().defaultTo(sql`'DRAFT'`))

    .addColumn("customerId", "uuid", (col) => col.references("customers.id").onDelete("restrict"))
    .addUniqueConstraint("unique_orders_code_per_customer", ["code", "customerId"])

    .addColumn("creditTermsId", "uuid", (col) => col.references("credit_terms.id").onDelete("restrict"))

    .addColumn("expectedDeliveryAt", "timestamptz")
    .addColumn("termsAndConditions", "text")
    .addColumn("metadata", "json")

    .addColumn("taxableAmount", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("nonTaxableAmount", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("subTotal", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("totalDiscount", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("totalVatAmount", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("totalAmount", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("discountType", sql`discount_type`)
    .addColumn("discountValue", "double precision")

    .addColumn("approvedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("approvedAt", "timestamptz")
    .addColumn("voidedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("voidReason", "varchar(255)", (col) => col.defaultTo(null))
    .addColumn("voidedAt", "timestamptz")
    .addColumn("completedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("completedAt", "timestamptz")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("sales_orders_warehouseId_idx").on("sales_orders").column("warehouseId").execute();
  await db.schema.createIndex("sales_orders_customerId_idx").on("sales_orders").column("customerId").execute();
  await db.schema.createIndex("sales_orders_fiscalYear_idx").on("sales_orders").column("fiscalYear").execute();
  await db.schema.createIndex("sales_orders_branchId_idx").on("sales_orders").column("branchId").execute();
  await db.schema.createIndex("sales_orders_code_idx").on("sales_orders").column("code").execute();
  await db.schema.createIndex("sales_orders_refNo_idx").on("sales_orders").column("refNo").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("sales_orders_code_idx").execute();
  await db.schema.dropIndex("sales_orders_warehouseId_idx").execute();
  await db.schema.dropIndex("sales_orders_customerId_idx").execute();
  await db.schema.dropIndex("sales_orders_fiscalYear_idx").execute();
  await db.schema.dropIndex("sales_orders_branchId_idx").execute();
  await db.schema.dropIndex("sales_orders_refNo_idx").execute();

  //Drop table
  await db.schema.dropTable("sales_orders").ifExists().execute();
}
