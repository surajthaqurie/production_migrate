import { sql, Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("stock_in_transit_openings")
    // .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("fiscalYear", "varchar(7)", (col) => col.notNull())
    .addColumn("previousFiscalYear", "varchar(7)", (col) => col.notNull())

    .addColumn("stockInTransitId", "uuid", (col) => col.references("stock_in_transit.id").notNull().onDelete("restrict"))
    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))

    // .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
    // .addColumn("status", sql`material_transit_status`, (col) => col.notNull().defaultTo(sql`'IN_TRANSIT'`))

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addUniqueConstraint("unique_stock_in_transit_opening", ["fiscalYear", "stockInTransitId"])
    .execute();

  // Indexes for performance
  await db.schema.createIndex("stock_in_transit_openings_stock_idx").on("stock_in_transit_openings").column("stockInTransitId").execute();
  await db.schema.createIndex("stock_in_transit_openings_fy_idx").on("stock_in_transit_openings").column("fiscalYear").execute();
  await db.schema.createIndex("stock_in_transit_openings_branch_idx").on("stock_in_transit_openings").column("branchId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("stock_in_transit_openings_stock_idx").execute();
  await db.schema.dropIndex("stock_in_transit_openings_fy_idx").execute();
  await db.schema.dropIndex("stock_in_transit_openings_branch_idx").execute();

  //Drop table
  await db.schema.dropTable("stock_in_transit_openings").ifExists().execute();
}
