import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await sql`
    CREATE TYPE order_bill_status AS ENUM (
      'DRAFT',
      'PENDING',
      'APPROVED',
      'PARTIAL_PAID',
      'COMPLETED',
      'VOID'      
    )
  `.execute(db);
}

export async function down(db: Kysely<DB>): Promise<void> {
  await sql`DROP TYPE IF EXISTS order_bill_status CASCADE`.execute(db);
}
