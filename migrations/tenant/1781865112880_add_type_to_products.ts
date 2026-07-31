import { Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .alterTable("products")
    .addColumn("productType", "varchar", (col) => col.notNull().defaultTo("PRODUCT"))
    .execute();

  await db.schema.createIndex("products_productType_idx").on("products").column("productType").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("products_productType_idx").execute();
  await db.schema.alterTable("products").dropColumn("productType").execute();
}
