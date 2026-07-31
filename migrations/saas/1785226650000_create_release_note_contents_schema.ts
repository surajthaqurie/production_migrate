import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("release_note_contents")
    .ifNotExists()
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    // The note this bullet belongs to; a note's changelog is the ordered set of rows sharing this id.
    .addColumn("releaseNoteId", "uuid", (col) => col.notNull().references("release_notes.id").onDelete("cascade"))
    // The bullet's text, e.g. "Reduced checkout load time".
    .addColumn("label", "text", (col) => col.notNull())

    // Position within the note's content list; preserved across edits/reordering.
    .addColumn("displayOrder", "integer", (col) => col.notNull().defaultTo(0))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("release_note_contents_release_note_id_idx").on("release_note_contents").column("releaseNoteId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("release_note_contents_release_note_id_idx").ifExists().execute();

  //Drop Table
  await db.schema.dropTable("release_note_contents").ifExists().execute();
}
