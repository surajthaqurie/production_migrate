"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("purchase_bill_prints")
        .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("billId", "uuid", (col) => col.references("purchase_order_bills.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("purchase_bill_print_user_idx").on("purchase_bill_prints").column("userId").execute();
    await db.schema.createIndex("purchase_bill_print_bill_idx").on("purchase_bill_prints").column("billId").execute();
}
async function down(db) {
    await db.schema.dropIndex("purchase_bill_print_user_idx").execute();
    await db.schema.dropIndex("purchase_bill_print_bill_idx").execute();
    await db.schema.dropTable("purchase_bill_prints").ifExists().execute();
}
//# sourceMappingURL=1765098882776_purchase_bill_print.js.map