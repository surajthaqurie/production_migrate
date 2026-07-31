"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("general_configs")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("baseDomain", "text", (col) => col.notNull().unique())
        .addColumn("trailDays", "integer", (col) => col.notNull())
        .addColumn("trialExtendDays", "integer", (col) => col.notNull())
        .addColumn("ecommercePrefix", "varchar(100)", (col) => col.notNull())
        .addColumn("tenantPrefix", "varchar(100)", (col) => col.notNull())
        .addColumn("branchPrice", "double precision", (col) => col.notNull())
        .addColumn("gracePeriod", "integer", (col) => col.notNull())
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
}
async function down(db) {
    await db.schema.dropTable("general_configs").execute();
}
//# sourceMappingURL=1781586090322_general_configuration_schema.js.map