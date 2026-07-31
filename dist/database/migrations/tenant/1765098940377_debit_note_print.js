"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("debit_note_prints")
        .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("noteId", "uuid", (col) => col.references("debit_notes.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("debit_note_print_user_idx").on("debit_note_prints").column("userId").execute();
    await db.schema.createIndex("debit_note_print_debit_note_idx").on("debit_note_prints").column("noteId").execute();
}
async function down(db) {
    await db.schema.dropIndex("debit_note_print_user_idx").execute();
    await db.schema.dropIndex("debit_note_print_debit_note_idx").execute();
    await db.schema.dropTable("debit_note_prints").ifExists().execute();
}
//# sourceMappingURL=1765098940377_debit_note_print.js.map