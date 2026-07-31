import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("tenant_follow_up_files")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("followUpId", "uuid", (col) => col.notNull().references("tenant_follow_ups.id").onDelete("cascade"))
    .addColumn("fileId", "uuid", (col) => col.notNull().references("system_files.id").onDelete("restrict"))

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .addUniqueConstraint("unique_tenant_follow_up_files_follow_up_file", ["followUpId", "fileId"])

    .execute();

  await db.schema.createIndex("idx_tenant_follow_up_files_follow_up").on("tenant_follow_up_files").column("followUpId").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("idx_tenant_follow_up_files_follow_up").ifExists().execute();

  //Drop table
  await db.schema.dropTable("tenant_follow_up_files").ifExists().execute();
}
