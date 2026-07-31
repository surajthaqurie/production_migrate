import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("debit_note_prints")

    .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("noteId", "uuid", (col) => col.references("debit_notes.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .execute();

  await db.schema.createIndex("debit_note_print_user_idx").on("debit_note_prints").column("userId").execute();
  await db.schema.createIndex("debit_note_print_debit_note_idx").on("debit_note_prints").column("noteId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("debit_note_print_user_idx").execute();
  await db.schema.dropIndex("debit_note_print_debit_note_idx").execute();

  //Drop table
  await db.schema.dropTable("debit_note_prints").ifExists().execute();
}
