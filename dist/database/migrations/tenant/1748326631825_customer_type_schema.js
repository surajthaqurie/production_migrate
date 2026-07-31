"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("customer_types")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("slug", "text", (col) => col.notNull().unique())
        .addColumn("discountType", (0, kysely_1.sql) `discount_type`, (col) => col.notNull())
        .addColumn("discountValue", "double precision", (col) => col.notNull())
        .addColumn("description", "text")
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("isDeleted", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("deletedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("deletedAt", "timestamptz")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("customer_types_createdBy_idx").on("customer_types").column("createdBy").execute();
    await db.schema.createIndex("customer_types_isDeleted_idx").on("customer_types").column("isDeleted").execute();
}
async function down(db) {
    await db.schema.dropIndex("customer_types_slug_idx").ifExists().execute();
    await db.schema.dropIndex("customer_types_createdBy_idx").ifExists().execute();
    await db.schema.dropIndex("customer_types_isDeleted_idx").ifExists().execute();
    await db.schema.dropTable("customer_types").ifExists().execute();
}
//# sourceMappingURL=1748326631825_customer_type_schema.js.map