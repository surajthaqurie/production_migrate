import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await sql`
    CREATE TYPE material_transit_status AS ENUM (
      'IN_TRANSIT',
      'SETTLED',
      'VOIDED'     
    )
  `.execute(db);
}

export async function down(db: Kysely<DB>): Promise<void> {
  await sql`DROP TYPE IF EXISTS material_transit_status CASCADE`.execute(db);
}
