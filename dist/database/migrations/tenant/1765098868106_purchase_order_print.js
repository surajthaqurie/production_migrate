"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("purchase_order_prints")
        .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("orderId", "uuid", (col) => col.references("purchase_orders.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("purchase_order_print_user_idx").on("purchase_order_prints").column("userId").execute();
    await db.schema.createIndex("purchase_order_print_order_idx").on("purchase_order_prints").column("orderId").execute();
}
async function down(db) {
    await db.schema.dropIndex("purchase_order_print_user_idx").execute();
    await db.schema.dropIndex("purchase_order_print_order_idx").execute();
    await db.schema.dropTable("purchase_order_prints").ifExists().execute();
}
//# sourceMappingURL=1765098868106_purchase_order_print.js.map