import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("subscription_overrides")
    // Surrogate Primary Key
    .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))

    // Foreign key pointing to the target subscription
    .addColumn("subscriptionId", "uuid", (col) => col.notNull().references("subscriptions.id").onDelete("cascade"))

    // The negotiated base price/amount for this custom subscription
    .addColumn("price", "double precision", (col) => col.notNull())

    // The currency this negotiated price is in (may differ from the plan's default currency)
    .addColumn("currency", "varchar(3)", (col) => col.notNull())

    // The billing interval (e.g., MONTHLY or ANNUAL) for this custom subscription
    .addColumn("interval", "varchar(20)", (col) => col.notNull())

    // The status of this override
    .addColumn("status", "varchar(20)", (col) => col.notNull().defaultTo("PENDING"))

    // The reason/justification for granting this override
    .addColumn("overrideReason", "text")

    .addColumn("approvedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("approvedAt", "timestamptz")

    // Audit and trace fields
    .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
    .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))

    .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
    .addColumn("disableReason", "text")
    .addColumn("deletedAt", "timestamptz")

    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  // Index on subscriptionId for lookup optimization
  await db.schema.createIndex("subscription_overrides_subscription_idx").on("subscription_overrides").column("subscriptionId").execute();

  // Index on status for fast filtering of pending/approved overrides
  await db.schema.createIndex("subscription_overrides_status_idx").on("subscription_overrides").column("status").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("subscription_overrides_status_idx").ifExists().execute();
  await db.schema.dropIndex("subscription_overrides_subscription_idx").ifExists().execute();

  //Drop table
  await db.schema.dropTable("subscription_overrides").ifExists().execute();
}
