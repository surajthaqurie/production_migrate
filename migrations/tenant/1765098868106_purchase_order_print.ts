import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("purchase_order_prints")

    .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("orderId", "uuid", (col) => col.references("purchase_orders.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("purchase_order_print_user_idx").on("purchase_order_prints").column("userId").execute();
  await db.schema.createIndex("purchase_order_print_order_idx").on("purchase_order_prints").column("orderId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("purchase_order_print_user_idx").execute();
  await db.schema.dropIndex("purchase_order_print_order_idx").execute();

  //Drop table
  await db.schema.dropTable("purchase_order_prints").ifExists().execute();
}
