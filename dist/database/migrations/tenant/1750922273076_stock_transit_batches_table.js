"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("stock_issue_transit_batches")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("transitItemId", "uuid", (col) => col.references("stock_issue_transit.id").notNull().onDelete("cascade"))
        .addColumn("batchId", "uuid", (col) => col.references("product_batch.id").notNull().onDelete("restrict"))
        .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addUniqueConstraint("unique_stock_transit_batches", ["transitItemId", "batchId"])
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("stock_issue_transit_batches_idx").on("stock_issue_transit_batches").column("transitItemId").execute();
    await db.schema.createIndex("stock_issue_transit_batches_batch_idx").on("stock_issue_transit_batches").column("batchId").execute();
}
async function down(db) {
    await db.schema.dropIndex("stock_issue_transit_batches_idx").execute();
    await db.schema.dropIndex("stock_issue_transit_batches_batch_idx").execute();
    await db.schema.dropTable("stock_issue_transit_batches").ifExists().execute();
}
//# sourceMappingURL=1750922273076_stock_transit_batches_table.js.map