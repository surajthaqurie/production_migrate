"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("plan_addon_payment_documents")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("tenantId", "uuid", (col) => col.notNull().references("tenants.id").onDelete("cascade"))
        .addColumn("paymentId", "uuid", (col) => col.notNull().references("plan_addon_payments.id").onDelete("cascade"))
        .addColumn("fileId", "uuid", (col) => col.notNull().references("system_files.id").onDelete("restrict"))
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("idx_plan_addon_payment_documents_payment").on("plan_addon_payment_documents").column("paymentId").execute();
    await db.schema.createIndex("idx_plan_addon_payment_documents_tenant").on("plan_addon_payment_documents").column("tenantId").execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_plan_addon_payment_documents_tenant").ifExists().execute();
    await db.schema.dropIndex("idx_plan_addon_payment_documents_payment").ifExists().execute();
    await db.schema.dropTable("plan_addon_payment_documents").ifExists().execute();
}
//# sourceMappingURL=1783681764885_create_plan_addon_payment_documents_schema.js.map