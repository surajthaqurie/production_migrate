import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("credit_note_prints")

    .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("noteId", "uuid", (col) => col.references("credit_notes.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("credit_note_print_user_idx").on("credit_note_prints").column("userId").execute();
  await db.schema.createIndex("credit_note_print_credit_note_idx").on("credit_note_prints").column("noteId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("credit_note_print_user_idx").execute();
  await db.schema.dropIndex("credit_note_print_credit_note_idx").execute();

  //Drop table
  await db.schema.dropTable("credit_note_prints").ifExists().execute();
}
