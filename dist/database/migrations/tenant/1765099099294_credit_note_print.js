"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("credit_note_prints")
        .addColumn("userId", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("noteId", "uuid", (col) => col.references("credit_notes.id").notNull().onDelete("restrict"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("credit_note_print_user_idx").on("credit_note_prints").column("userId").execute();
    await db.schema.createIndex("credit_note_print_credit_note_idx").on("credit_note_prints").column("noteId").execute();
}
async function down(db) {
    await db.schema.dropIndex("credit_note_print_user_idx").execute();
    await db.schema.dropIndex("credit_note_print_credit_note_idx").execute();
    await db.schema.dropTable("credit_note_prints").ifExists().execute();
}
//# sourceMappingURL=1765099099294_credit_note_print.js.map