"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("user_date_format_preferences")
        .addColumn("userId", "uuid", (col) => col.primaryKey().references("admins.id").onDelete("cascade"))
        .addColumn("dateFormat", "varchar(2)", (col) => col.notNull().defaultTo("AD"))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
}
async function down(db) {
    await db.schema.dropTable("user_date_format_preferences").execute();
}
//# sourceMappingURL=1785066499328_create_user_date_format_preferences_table.js.map