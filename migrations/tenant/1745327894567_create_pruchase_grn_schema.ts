import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("purchase_grn")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("code", "varchar(18)", (col) => col.notNull())
    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())

    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))

    .addColumn("warehouseId", "uuid", (col) => col.references("warehouses.id").onDelete("restrict"))
    .addColumn("supplierId", "uuid", (col) => col.references("suppliers.id").onDelete("restrict"))
    .addColumn("purchaseOrderId", "uuid", (col) => col.references("purchase_orders.id").onDelete("restrict"))

    .addColumn("status", sql`order_grn_status`, (col) => col.notNull().defaultTo(sql`'DRAFT'`))
    .addColumn("receiveDate", "timestamptz")

    .addUniqueConstraint("unique_grn_code_per_supplier", ["code", "supplierId"])

    .addColumn("approvedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("approvedAt", "timestamptz")

    .addColumn("completedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("completedAt", "timestamptz")

    .addColumn("voidedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("voidedAt", "timestamptz")
    .addColumn("voidReason", "text")

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

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("purchase_grn_warehouseId_idx").on("purchase_grn").column("warehouseId").execute();
  await db.schema.createIndex("purchase_grn_supplierId_idx").on("purchase_grn").column("supplierId").execute();
  await db.schema.createIndex("purchase_grn_fiscalYear_idx").on("purchase_grn").column("fiscalYear").execute();
  await db.schema.createIndex("purchase_grn_branchId_idx").on("purchase_grn").column("branchId").execute();
  await db.schema.createIndex("purchase_grn_code_idx").on("purchase_grn").column("code").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("purchase_grn_code_idx").execute();
  await db.schema.dropIndex("purchase_grn_warehouseId_idx").execute();
  await db.schema.dropIndex("purchase_grn_supplierId_idx").execute();
  await db.schema.dropIndex("purchase_grn_fiscalYear_idx").execute();
  await db.schema.dropIndex("purchase_grn_branchId_idx").execute();

  //Drop table
  await db.schema.dropTable("purchase_grn").ifExists().execute();
}
