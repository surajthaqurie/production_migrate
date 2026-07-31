"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("api_logs")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("integrationId", "uuid")
        .addColumn("tenantId", "uuid", (col) => col.references("companies.id").onDelete("cascade"))
        .addColumn("endpoint", "varchar(255)", (col) => col.notNull())
        .addColumn("method", "varchar(10)", (col) => col.notNull())
        .addColumn("requestPayload", "jsonb")
        .addColumn("responseStatus", "integer", (col) => col.notNull())
        .addColumn("responsePayload", "jsonb")
        .addColumn("executedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("api_logs_integrationId_idx").on("api_logs").column("integrationId").execute();
    await db.schema.createIndex("api_logs_tenantId_idx").on("api_logs").column("tenantId").execute();
    await db.schema.createIndex("api_logs_createdAt_idx").on("api_logs").column("createdAt").execute();
}
async function down(db) {
    await db.schema.dropIndex("api_logs_createdAt_idx").ifExists().execute();
    await db.schema.dropIndex("api_logs_tenantId_idx").ifExists().execute();
    await db.schema.dropIndex("api_logs_integrationId_idx").ifExists().execute();
    await db.schema.dropTable("api_logs").ifExists().execute();
}
//# sourceMappingURL=1781865112877_create_api_logs_table.js.map