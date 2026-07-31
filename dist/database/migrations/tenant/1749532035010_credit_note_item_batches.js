"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("credit_note_item_batches")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("noteItemId", "uuid", (col) => col.references("credit_note_items.id").notNull().onDelete("cascade"))
        .addColumn("batchId", "uuid", (col) => col.references("product_batch.id").notNull().onDelete("restrict"))
        .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addUniqueConstraint("unique_credit_note_item_batches", ["noteItemId", "batchId"])
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("credit_note_item_batches_idx").on("credit_note_item_batches").column("noteItemId").execute();
    await db.schema.createIndex("credit_note_item_batches_batch_idx").on("credit_note_item_batches").column("batchId").execute();
}
async function down(db) {
    await db.schema.dropIndex("credit_note_item_batches_idx").execute();
    await db.schema.dropIndex("credit_note_item_batches_batch_idx").execute();
    await db.schema.dropTable("credit_note_item_batches").ifExists().execute();
}
//# sourceMappingURL=1749532035010_credit_note_item_batches.js.map