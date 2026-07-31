import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await sql`
	CREATE TYPE note_status AS ENUM (
	  'DRAFT',
	  'PENDING',
	  'APPROVED',
	  'VOID'      
	)
  `.execute(db);
}

export async function down(db: Kysely<DB>): Promise<void> {
  await sql`DROP TYPE IF EXISTS note_status CASCADE`.execute(db);
}
