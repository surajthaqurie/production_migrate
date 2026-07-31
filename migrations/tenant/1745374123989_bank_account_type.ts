import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await sql`
    CREATE TYPE bank_account_type AS ENUM (
      'SAVING',
      'CURRENT'
    )
  `.execute(db);
}

export async function down(db: Kysely<DB>): Promise<void> {
  await sql`DROP TYPE IF EXISTS bank_account_type CASCADE`.execute(db);
}
