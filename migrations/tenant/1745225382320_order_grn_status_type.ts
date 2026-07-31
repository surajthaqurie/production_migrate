import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await sql`
    CREATE TYPE order_grn_status AS ENUM (
      'DRAFT',
      'PENDING',
      'APPROVED',
      'VOID',
      'COMPLETED'      
    )
  `.execute(db);
}

export async function skip_down(db: Kysely<DB>): Promise<void> {
  await sql`DROP TYPE IF EXISTS order_grn_status CASCADE`.execute(db);
}
