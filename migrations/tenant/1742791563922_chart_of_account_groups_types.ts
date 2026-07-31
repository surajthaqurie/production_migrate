import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await sql`
    CREATE TYPE account_chart_groups AS ENUM (
      'ASSET', --1000 – 1999
      'LIABILITY', --2000 – 2999
      'EQUITY', --3000 – 3999
      'REVENUE', --4000 – 4999
      'EXPENSE' --5000-5999
    )
  `.execute(db);
}

export async function down(db: Kysely<DB>): Promise<void> {
  await sql`DROP TYPE IF EXISTS account_chart_groups CASCADE`.execute(db);
}
