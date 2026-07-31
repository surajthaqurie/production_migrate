"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("sales_order_prints")
        .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("orderId", "uuid", (col) => col.references("sales_orders.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("sales_order_print_user_idx").on("sales_order_prints").column("userId").execute();
    await db.schema.createIndex("sales_order_print_order_idx").on("sales_order_prints").column("orderId").execute();
}
async function down(db) {
    await db.schema.dropIndex("sales_order_print_user_idx").execute();
    await db.schema.dropIndex("sales_order_print_order_idx").execute();
    await db.schema.dropTable("sales_order_prints").ifExists().execute();
}
//# sourceMappingURL=1765099072900_sales_order_print.js.map