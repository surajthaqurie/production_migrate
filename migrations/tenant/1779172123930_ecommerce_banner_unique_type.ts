import { Kysely, sql } from "kysely";
import { DB } from "src/tenant-db.interface";

export async function up(db: Kysely<DB>): Promise<void> {
  await sql`ALTER TABLE "ecommerce_hero_banners" DROP CONSTRAINT IF EXISTS "unique_ecommerce_hero_banners_tenant_heading";`.execute(db);
  await sql`ALTER TABLE "ecommerce_hero_banners" ADD CONSTRAINT "unique_ecommerce_hero_banners_tenant_type_heading" UNIQUE ("tenantId", "type", "headingSlug");`.execute(db);
}

export async function down(db: Kysely<DB>): Promise<void> {
  await sql`ALTER TABLE "ecommerce_hero_banners" DROP CONSTRAINT IF EXISTS "unique_ecommerce_hero_banners_tenant_type_heading";`.execute(db);
  await sql`ALTER TABLE "ecommerce_hero_banners" ADD CONSTRAINT "unique_ecommerce_hero_banners_tenant_heading" UNIQUE ("tenantId", "headingSlug");`.execute(db);
}
