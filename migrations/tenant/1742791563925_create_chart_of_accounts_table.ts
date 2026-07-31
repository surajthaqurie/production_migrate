import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("account_charts")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.unique().notNull())
    .addColumn("isDefault", "boolean", (col) => col.defaultTo(false))

    .addColumn("groupType", sql`account_chart_groups`, (col) => col.notNull())

    .addColumn("description", "text")
    .addColumn("metadata", "json")

    .addColumn("parentId", "uuid", (col) => col.references("account_charts.id").onDelete("set null"))

    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")

    //@Unique only for the same parent
    // .addUniqueConstraint("unique_account_chart_slug_per_parent", ["slug", "parentId"])

    .addColumn("createdAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();

  await db.schema.createIndex("account_charts_name_idx").on("account_charts").column("name").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("account_charts_name_idx").execute();

  //Drop table
  await db.schema.dropTable("account_charts").ifExists().execute();
}
