import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("printable_configs")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("size", "varchar(10)", (col) => col.notNull())
    .addColumn("type", "varchar(255)", (col) => col.notNull())

    .addColumn("branchId", "uuid", (col) => col.references("branches.id").notNull().onDelete("restrict"))

    .addColumn("imageUrl", "text", (col) => col.notNull())
    .addColumn("isActive", "boolean", (col) => col.notNull().defaultTo(false))

    .addColumn("metadata", "json")
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addUniqueConstraint("unique_branch_printable_config", ["branchId", "type", "size"])

    .execute();

  await db.schema.createIndex("printable_configs_branch_idx").on("printable_configs").column("branchId").execute();
  await db.schema.createIndex("printable_configs_type_idx").on("printable_configs").column("type").execute();
  await db.schema.createIndex("printable_configs_created_by_idx").on("printable_configs").column("createdBy").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("printable_configs_branch_idx").execute();
  await db.schema.dropIndex("printable_configs_type_idx").execute();
  await db.schema.dropIndex("printable_configs_created_by_idx").execute();

  //Drop table
  await db.schema.dropTable("printable_configs").ifExists().execute();
}
