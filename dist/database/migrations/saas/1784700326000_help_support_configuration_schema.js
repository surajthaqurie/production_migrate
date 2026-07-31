"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("help_support_configs")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("whatsappNumber", "varchar(20)", (col) => col.notNull())
        .addColumn("viberNumber", "varchar(20)", (col) => col.notNull())
        .addColumn("email", "varchar(255)", (col) => col.notNull())
        .addColumn("contactNumber", "varchar(20)", (col) => col.notNull())
        .addColumn("browseDocUrl", "text")
        .addColumn("youtubeUrl", "text")
        .addColumn("resourceUrl", "text")
        .addColumn("metadata", "json")
        .addColumn("createdBy", "uuid", (col) => col.notNull().references("admins.id").onDelete("restrict"))
        .addColumn("updatedBy", "uuid", (col) => col.references("admins.id").onDelete("set null"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
}
async function down(db) {
    await db.schema.dropTable("help_support_configs").execute();
}
//# sourceMappingURL=1784700326000_help_support_configuration_schema.js.map