import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await sql`
    CREATE TYPE product_status AS ENUM (
      'NO_STOCK',
      'ON_STOCK',
      'OUT_OF_STOCK',
      'MODERATE_STOCK',
      'LOW_STOCK'
    )
  `.execute(db);
}

export async function down(db: Kysely<DB>): Promise<void> {
  await sql`DROP TYPE IF EXISTS product_status CASCADE`.execute(db);
}
