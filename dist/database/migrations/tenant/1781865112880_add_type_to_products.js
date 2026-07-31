"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable("products")
        .addColumn("productType", "varchar", (col) => col.notNull().defaultTo("PRODUCT"))
        .execute();
    await db.schema.createIndex("products_productType_idx").on("products").column("productType").execute();
}
async function down(db) {
    await db.schema.dropIndex("products_productType_idx").execute();
    await db.schema.alterTable("products").dropColumn("productType").execute();
}
//# sourceMappingURL=1781865112880_add_type_to_products.js.map