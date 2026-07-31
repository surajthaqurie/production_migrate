import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("release_notes")
    .ifNotExists()
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    // Semantic version this note belongs to, e.g. "1.4.2" — unique so one note per release.
    .addColumn("version", "varchar(50)", (col) => col.notNull().unique())
    // Headline shown in the release notes list, e.g. "Improved checkout performance".
    .addColumn("title", "varchar(255)", (col) => col.notNull())

    // Short teaser shown in list views, before the reader opens the full note.
    .addColumn("summary", "text")

    // Actual date the version shipped — independent of when the note is published/announced.
    .addColumn("releaseDate", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    // Draft vs. live visibility toggle for the note itself.
    .addColumn("published", "boolean", (col) => col.notNull().defaultTo(false))

    // Timestamp of when it was first published; cleared if unpublished.
    .addColumn("publishedAt", "timestamptz")

    // Free-form extension point for future data without needing a migration.
    .addColumn("metadata", "json")

    // --- Soft delete & audit ---
    .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("restrict"))
    .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("release_notes_version_idx").on("release_notes").column("version").execute();
  await db.schema.createIndex("release_notes_published_idx").on("release_notes").column("published").execute();
  await db.schema.createIndex("release_notes_is_deleted_idx").on("release_notes").column("isDeleted").execute();
  await db.schema.createIndex("release_notes_release_date_idx").on("release_notes").column("releaseDate").execute();
  await db.schema.createIndex("release_notes_created_by_idx").on("release_notes").column("createdBy").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("release_notes_created_by_idx").ifExists().execute();
  await db.schema.dropIndex("release_notes_release_date_idx").ifExists().execute();
  await db.schema.dropIndex("release_notes_is_deleted_idx").ifExists().execute();
  await db.schema.dropIndex("release_notes_published_idx").ifExists().execute();
  await db.schema.dropIndex("release_notes_version_idx").ifExists().execute();

  //Drop Table
  await db.schema.dropTable("release_notes").ifExists().execute();
}
