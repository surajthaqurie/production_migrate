import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await sql`
	CREATE TYPE adjustment_item_types AS ENUM (
	  'IN',
	  'OUT'
	)
  `.execute(db);
}

export async function down(db: Kysely<DB>): Promise<void> {
  await sql`DROP TYPE IF EXISTS adjustment_item_types CASCADE`.execute(db);
}
