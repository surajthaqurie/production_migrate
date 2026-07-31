"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("purchase_grn_prints")
        .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("grnId", "uuid", (col) => col.references("purchase_grn.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("purchase_grn_print_user_idx").on("purchase_grn_prints").column("userId").execute();
    await db.schema.createIndex("purchase_grn_print_grn_idx").on("purchase_grn_prints").column("grnId").execute();
}
async function down(db) {
    await db.schema.dropIndex("purchase_grn_print_user_idx").execute();
    await db.schema.dropIndex("purchase_grn_print_grn_idx").execute();
    await db.schema.dropTable("purchase_grn_prints").ifExists().execute();
}
//# sourceMappingURL=1765098893386_purchase_grn_print.js.map