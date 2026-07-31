"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("api_usage_metrics")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("integrationId", "uuid", (col) => col.notNull())
        .addColumn("yearMonth", "varchar(7)", (col) => col.notNull())
        .addColumn("callCount", "integer", (col) => col.defaultTo(0).notNull())
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("api_usage_metrics_int_ym_idx").on("api_usage_metrics").columns(["integrationId", "yearMonth"]).unique().execute();
}
async function down(db) {
    await db.schema.dropIndex("api_usage_metrics_int_ym_idx").ifExists().execute();
    await db.schema.dropTable("api_usage_metrics").ifExists().execute();
}
//# sourceMappingURL=1781865112878_create_api_usage_metrics_table.js.map