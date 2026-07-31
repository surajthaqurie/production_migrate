import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await sql`
    CREATE TYPE warehouse_type AS ENUM (
      'SELLABLE',
      'STORAGE_ONLY'
    )
  `.execute(db);
}

export async function down(db: Kysely<DB>): Promise<void> {
  await sql`DROP TYPE IF EXISTS warehouse_type CASCADE`.execute(db);
}
