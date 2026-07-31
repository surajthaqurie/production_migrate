"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("password_resets")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("adminId", "uuid", (col) => col.notNull().references("admins.id").onDelete("cascade"))
        .addColumn("token", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("expiresAt", "timestamptz", (col) => col.notNull())
        .addColumn("expired", "boolean", (col) => col.notNull().defaultTo(false))
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema.createIndex("password_resets_token_idx").on("password_resets").column("token").execute();
    await db.schema.createIndex("password_resets_adminId_idx").on("password_resets").column("adminId").execute();
    await db.schema.createIndex("password_resets_expiresAt_idx").on("password_resets").column("expiresAt").execute();
    await db.schema.createIndex("password_resets_adminId_expired_idx").on("password_resets").columns(["adminId", "expired"]).execute();
}
async function down(db) {
    await db.schema.dropIndex("password_resets_adminId_expired_idx").execute();
    await db.schema.dropIndex("password_resets_expiresAt_idx").execute();
    await db.schema.dropIndex("password_resets_adminId_idx").execute();
    await db.schema.dropIndex("password_resets_token_idx").execute();
    await db.schema.dropTable("password_resets").ifExists().execute();
}
//# sourceMappingURL=1780034046105_create_password_reset_schema.js.map