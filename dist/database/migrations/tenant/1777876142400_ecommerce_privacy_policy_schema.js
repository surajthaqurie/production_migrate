"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("ecommerce_privacy_policy")
        .addColumn("tenantId", "uuid", (col) => col.primaryKey().references("companies.id").onDelete("cascade"))
        .addColumn("content", "text", (col) => col.notNull().defaultTo(""))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("ecommerce_privacy_policy_createdBy_idx").on("ecommerce_privacy_policy").column("createdBy").execute();
}
async function down(db) {
    await db.schema.dropIndex("ecommerce_privacy_policy_createdBy_idx").on("ecommerce_privacy_policy").execute();
    await db.schema.dropTable("ecommerce_privacy_policy").ifExists().execute();
}
//# sourceMappingURL=1777876142400_ecommerce_privacy_policy_schema.js.map