import { Kysely } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  // COUNT features only: when true, unused allowance from this reset period rolls forward into the next
  // instead of being lost — the ceiling is computed in code from `limit` and days elapsed, not stored here.
  await db.schema
    .alterTable("subscription_plan_features")
    .addColumn("isCarryOver", "boolean", (col) => col.notNull().defaultTo(false))
    .execute();
  await db.schema
    .alterTable("subscription_feature_overrides")
    .addColumn("isCarryOver", "boolean", (col) => col.notNull().defaultTo(false))
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable("subscription_feature_overrides").dropColumn("isCarryOver").execute();
  await db.schema.alterTable("subscription_plan_features").dropColumn("isCarryOver").execute();
}
