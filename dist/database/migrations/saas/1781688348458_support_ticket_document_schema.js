"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("support_ticket_documents")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("ticketId", "uuid", (col) => col.notNull().references("support_tickets.id").onDelete("cascade"))
        .addColumn("fileUrl", "text", (col) => col.notNull())
        .addColumn("originalName", "text", (col) => col.notNull())
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("tenantCreatedBy", "uuid", (col) => col.references("tenants_users.id").onDelete("set null"))
        .execute();
    await db.schema.createIndex("idx_support_ticket_documents_ticket").on("support_ticket_documents").column("ticketId").execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_support_ticket_documents_ticket").ifExists().execute();
    await db.schema.dropTable("support_ticket_documents").ifExists().execute();
}
//# sourceMappingURL=1781688348458_support_ticket_document_schema.js.map