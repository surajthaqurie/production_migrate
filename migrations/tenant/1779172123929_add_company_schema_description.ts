import { type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable("companies").addColumn("description", "text").execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable("companies").dropColumn("description").execute();
}
