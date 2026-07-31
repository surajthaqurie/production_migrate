"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("cms_about_sections")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("aboutUsId", "uuid", (col) => col.notNull().references("cms_about_us.id").onDelete("cascade"))
        .addColumn("sectionLabel", "varchar(255)", (col) => col.notNull())
        .addColumn("heading", "varchar(255)", (col) => col.notNull())
        .addColumn("subHeading", "varchar(255)", (col) => col.notNull())
        .addColumn("content", "text", (col) => col.notNull())
        .addColumn("quote", "text")
        .addColumn("quoteAuthor", "varchar(255)")
        .addColumn("quoteAuthorDesignation", "varchar(255)")
        .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("about_sections_about_us_id_idx").on("cms_about_sections").column("aboutUsId").execute();
}
async function down(db) {
    await db.schema.dropIndex("about_sections_about_us_id_idx").ifExists().execute();
    await db.schema.dropTable("cms_about_sections").ifExists().execute();
}
//# sourceMappingURL=1784700192415_create_cms_about_sections_schema.js.map