import { Kysely, sql } from "kysely";
import { DB } from "src/saas-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await sql`
    CREATE TYPE discount_type AS ENUM (
      'AMOUNT',
      'PERCENTAGE'      
    )
  `.execute(db);
}

export async function down(db: Kysely<DB>): Promise<void> {
  await sql`DROP TYPE IF EXISTS discount_type CASCADE`.execute(db);
}
