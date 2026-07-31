import { Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable("purchase_order_bills").addColumn("serialNumber", "varchar").execute();
  await db.schema.createIndex("purchase_order_bills_serialNumber_idx").on("purchase_order_bills").column("serialNumber").execute();

  await db.schema.alterTable("debit_notes").addColumn("serialNumber", "varchar").execute();
  await db.schema.createIndex("debit_notes_serialNumber_idx").on("debit_notes").column("serialNumber").execute();

  await db.schema.alterTable("sales_order_bills").addColumn("serialNumber", "varchar").execute();
  await db.schema.createIndex("sales_order_bills_serialNumber_idx").on("sales_order_bills").column("serialNumber").execute();

  await db.schema.alterTable("credit_notes").addColumn("serialNumber", "varchar").execute();
  await db.schema.createIndex("credit_notes_serialNumber_idx").on("credit_notes").column("serialNumber").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("purchase_order_bills_serialNumber_idx").execute();
  await db.schema.alterTable("purchase_order_bills").dropColumn("serialNumber").execute();

  await db.schema.dropIndex("debit_notes_serialNumber_idx").execute();
  await db.schema.alterTable("debit_notes").dropColumn("serialNumber").execute();

  await db.schema.dropIndex("sales_order_bills_serialNumber_idx").execute();
  await db.schema.alterTable("sales_order_bills").dropColumn("serialNumber").execute();

  await db.schema.dropIndex("credit_notes_serialNumber_idx").execute();
  await db.schema.alterTable("credit_notes").dropColumn("serialNumber").execute();
}
