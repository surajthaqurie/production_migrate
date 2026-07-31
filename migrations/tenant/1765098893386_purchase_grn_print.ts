import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("purchase_grn_prints")

    .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("grnId", "uuid", (col) => col.references("purchase_grn.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("purchase_grn_print_user_idx").on("purchase_grn_prints").column("userId").execute();
  await db.schema.createIndex("purchase_grn_print_grn_idx").on("purchase_grn_prints").column("grnId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("purchase_grn_print_user_idx").execute();
  await db.schema.dropIndex("purchase_grn_print_grn_idx").execute();

  //Drop table
  await db.schema.dropTable("purchase_grn_prints").ifExists().execute();
}
