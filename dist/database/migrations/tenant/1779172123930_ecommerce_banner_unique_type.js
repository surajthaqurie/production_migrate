"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `ALTER TABLE "ecommerce_hero_banners" DROP CONSTRAINT IF EXISTS "unique_ecommerce_hero_banners_tenant_heading";`.execute(db);
    await (0, kysely_1.sql) `ALTER TABLE "ecommerce_hero_banners" ADD CONSTRAINT "unique_ecommerce_hero_banners_tenant_type_heading" UNIQUE ("tenantId", "type", "headingSlug");`.execute(db);
}
async function down(db) {
    await (0, kysely_1.sql) `ALTER TABLE "ecommerce_hero_banners" DROP CONSTRAINT IF EXISTS "unique_ecommerce_hero_banners_tenant_type_heading";`.execute(db);
    await (0, kysely_1.sql) `ALTER TABLE "ecommerce_hero_banners" ADD CONSTRAINT "unique_ecommerce_hero_banners_tenant_heading" UNIQUE ("tenantId", "headingSlug");`.execute(db);
}
//# sourceMappingURL=1779172123930_ecommerce_banner_unique_type.js.map