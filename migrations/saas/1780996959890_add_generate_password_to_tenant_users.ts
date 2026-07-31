import { Kysely } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .alterTable("tenants_users")
    .addColumn("generatePassword", "boolean", (col) => col.defaultTo(true))
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable("tenants_users").dropColumn("generatePassword").execute();
}
