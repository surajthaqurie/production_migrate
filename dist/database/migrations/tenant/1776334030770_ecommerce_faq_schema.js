"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("ecommerce_faqs")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("tenantId", "uuid", (col) => col.references("companies.id").onDelete("cascade").notNull())
        .addColumn("question", "text", (col) => col.notNull())
        .addColumn("questionSlug", "text", (col) => col.notNull())
        .addColumn("answer", "text", (col) => col.notNull())
        .addColumn("sortOrder", "integer", (col) => col.notNull().defaultTo(0))
        .addColumn("createdBy", "uuid", (col) => col.references("admins.id").notNull().onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addUniqueConstraint("unique_ecommerce_faqs_tenant_question", ["tenantId", "questionSlug"])
        .execute();
    await db.schema.createIndex("ecommerce_faqs_tenant_idx").on("ecommerce_faqs").column("tenantId").execute();
    await db.schema.createIndex("ecommerce_faqs_sort_order_idx").on("ecommerce_faqs").column("sortOrder").execute();
}
async function down(db) {
    await db.schema.dropIndex("ecommerce_faqs_sort_order_idx").on("ecommerce_faqs").execute();
    await db.schema.dropIndex("ecommerce_faqs_tenant_idx").on("ecommerce_faqs").execute();
    await db.schema.dropTable("ecommerce_faqs").ifExists().execute();
}
//# sourceMappingURL=1776334030770_ecommerce_faq_schema.js.map