"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("product_adjustment_prints")
        .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("adjustmentId", "uuid", (col) => col.references("product_adjustments.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("product_adjustment_print_user_idx").on("product_adjustment_prints").column("userId").execute();
    await db.schema.createIndex("product_adjustment_print_adjustment_idx").on("product_adjustment_prints").column("adjustmentId").execute();
}
async function down(db) {
    await db.schema.dropIndex("product_adjustment_print_user_idx").execute();
    await db.schema.dropIndex("product_adjustment_print_adjustment_idx").execute();
    await db.schema.dropTable("product_adjustment_prints").ifExists().execute();
}
//# sourceMappingURL=1765098960184_product_adjusment_print.js.map