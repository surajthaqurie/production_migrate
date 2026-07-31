"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema.alterTable("companies").addColumn("description", "text").execute();
}
async function down(db) {
    await db.schema.alterTable("companies").dropColumn("description").execute();
}
//# sourceMappingURL=1779172123929_add_company_schema_description.js.map