"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("ecommerce_refund_policies")
        .addColumn("tenantId", "uuid", (col) => col.primaryKey().references("companies.id").onDelete("cascade"))
        .addColumn("content", "text", (col) => col.notNull().defaultTo(""))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("ecommerce_refund_policies_createdBy_idx").on("ecommerce_refund_policies").column("createdBy").execute();
}
async function down(db) {
    await db.schema.dropIndex("ecommerce_refund_policies_createdBy_idx").on("ecommerce_refund_policies").execute();
    await db.schema.dropTable("ecommerce_refund_policies").ifExists().execute();
}
//# sourceMappingURL=1778066843104_ecommerce_refund_policy_schema.js.map