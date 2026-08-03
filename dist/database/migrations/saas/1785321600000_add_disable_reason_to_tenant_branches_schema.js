"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema.alterTable("tenant_branches").addColumn("disableReason", "text").execute();
}
async function down(db) {
    await db.schema.alterTable("tenant_branches").dropColumn("disableReason").execute();
}
//# sourceMappingURL=1785321600000_add_disable_reason_to_tenant_branches_schema.js.map