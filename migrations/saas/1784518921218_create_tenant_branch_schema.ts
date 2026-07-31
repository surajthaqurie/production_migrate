import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("tenant_branches")
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))

    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull())
    .addColumn("isDefault", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("PENDING")) // PENDING | ACTIVE | FAILED

    .addColumn("location", "varchar(255)", (col) => col.notNull())
    .addColumn("city", "varchar(255)", (col) => col.notNull())
    .addColumn("state", "varchar(255)", (col) => col.notNull())
    .addColumn("zipCode", "varchar(20)")
    .addColumn("primaryPhone", "varchar(20)", (col) => col.notNull())

    .addColumn("primaryContractPerson", "varchar(255)")
    .addColumn("primaryEmail", "varchar(255)")

    .addColumn("metadata", "json")

    .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
    .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("deletedAt", "timestamptz")
    .addColumn("disableReason", "text")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

    .execute();

  await db.schema.createIndex("idx_tenant_branches_tenant").on("tenant_branches").column("tenantId").execute();
  await db.schema.createIndex("idx_tenant_branches_tenant_slug").on("tenant_branches").columns(["tenantId", "slug"]).unique().execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("idx_tenant_branches_tenant_slug").ifExists().execute();
  await db.schema.dropIndex("idx_tenant_branches_tenant").ifExists().execute();

  //Drop table
  await db.schema.dropTable("tenant_branches").ifExists().execute();
}
