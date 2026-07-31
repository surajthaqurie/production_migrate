import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await sql`
    CREATE TYPE material_transfer_status AS ENUM (
      -- 'DRAFT',
      'PENDING',
      'APPROVED',
      'VOID',
      'IN_TRANSIT',
      'COMPLETED'
    )
  `.execute(db);
}

export async function down(db: Kysely<DB>): Promise<void> {
  await sql`DROP TYPE IF EXISTS material_transfer_status CASCADE`.execute(db);
}
