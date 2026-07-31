"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("sales_bill_prints")
        .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("billId", "uuid", (col) => col.references("sales_order_bills.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("sales_bill_print_user_idx").on("sales_bill_prints").column("userId").execute();
    await db.schema.createIndex("sales_bill_print_sales_bill_idx").on("sales_bill_prints").column("billId").execute();
}
async function down(db) {
    await db.schema.dropIndex("sales_bill_print_user_idx").execute();
    await db.schema.dropIndex("sales_bill_print_order_idx").execute();
    await db.schema.dropTable("sales_bill_prints").ifExists().execute();
}
//# sourceMappingURL=1765099080845_sales_bill_print.js.map