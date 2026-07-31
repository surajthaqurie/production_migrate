import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("material_requisitions")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("code", "varchar(18)", (col) => col.notNull().unique())
    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
    .addColumn("status", sql`material_transfer_status`, (col) => col.notNull().defaultTo(sql`'PENDING'`))

    .addColumn("warehouseFromId", "uuid", (col) => col.references("warehouses.id").notNull().onDelete("restrict"))
    .addColumn("warehouseToId", "uuid", (col) => col.references("warehouses.id").notNull().onDelete("restrict"))

    .addColumn("requisitionDate", "timestamptz", (col) => col.notNull())
    .addColumn("requestAmount", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("transitAmount", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("receivedAmount", "double precision", (col) => col.notNull().defaultTo(0))

    .addColumn("metadata", "json")
    .addColumn("remarks", "text")
    .addColumn("refNo", "varchar(100)")

    .addColumn("approvedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("approvedAt", "timestamptz")

    .addColumn("transitedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("transitedAt", "timestamptz")

    .addColumn("voidedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("voidedAt", "timestamptz")
    .addColumn("voidReason", "text")

    .addColumn("completedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("completedAt", "timestamptz")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("material_requisitions_warehouseFromId_idx").on("material_requisitions").column("warehouseFromId").execute();
  await db.schema.createIndex("material_requisitions_warehouseToId_idx").on("material_requisitions").column("warehouseToId").execute();
  await db.schema.createIndex("material_requisitions_fiscalYear_idx").on("material_requisitions").column("fiscalYear").execute();
  await db.schema.createIndex("material_requisitions_refNo_idx").on("material_requisitions").column("refNo").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("material_requisitions_warehouseFromId_idx").execute();
  await db.schema.dropIndex("material_requisitions_warehouseToId_idx").execute();
  await db.schema.dropIndex("material_requisitions_fiscalYear_idx").execute();
  await db.schema.dropIndex("material_requisitions_refNo_idx").execute();

  //Drop table
  await db.schema.dropTable("material_requisitions").ifExists().execute();
}
