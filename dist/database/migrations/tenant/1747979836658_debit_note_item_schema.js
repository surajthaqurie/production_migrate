"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("debit_note_items")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("productId", "uuid", (col) => col.references("products.id").notNull().onDelete("restrict"))
        .addColumn("debitNoteId", "uuid", (col) => col.references("debit_notes.id").notNull().onDelete("restrict"))
        .addColumn("batchId", "uuid", (col) => col.references("product_batch.id").onDelete("restrict"))
        .addColumn("discountValue", "double precision")
        .addColumn("discountType", (0, kysely_1.sql) `discount_type`)
        .addColumn("vat", "double precision", (col) => col.defaultTo(0))
        .addColumn("ratePerItem", "double precision", (col) => col.notNull())
        .addColumn("quantity", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("totalPrice", "double precision", (col) => col.notNull().defaultTo(0))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("unique_debit_note_product", ["productId", "debitNoteId"])
        .execute();
    await db.schema.createIndex("debit_note_items_note_idx").on("debit_note_items").column("debitNoteId").execute();
    await db.schema.createIndex("debit_note_items_product_idx").on("debit_note_items").column("productId").execute();
}
async function down(db) {
    await db.schema.dropIndex("debit_note_items_note_idx").execute();
    await db.schema.dropIndex("debit_note_items_product_idx").execute();
    await db.schema.dropTable("debit_note_items").ifExists().execute();
}
//# sourceMappingURL=1747979836658_debit_note_item_schema.js.map