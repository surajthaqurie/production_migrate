"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable("tenants_users")
        .addColumn("generatePassword", "boolean", (col) => col.defaultTo(true))
        .execute();
}
async function down(db) {
    await db.schema.alterTable("tenants_users").dropColumn("generatePassword").execute();
}
//# sourceMappingURL=1780996959890_add_generate_password_to_tenant_users.js.map