"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable("subscription_plan_features")
        .addColumn("isCarryOver", "boolean", (col) => col.notNull().defaultTo(false))
        .execute();
    await db.schema
        .alterTable("subscription_feature_overrides")
        .addColumn("isCarryOver", "boolean", (col) => col.notNull().defaultTo(false))
        .execute();
}
async function down(db) {
    await db.schema.alterTable("subscription_feature_overrides").dropColumn("isCarryOver").execute();
    await db.schema.alterTable("subscription_plan_features").dropColumn("isCarryOver").execute();
}
//# sourceMappingURL=1784348540000_add_carry_over_to_subscription_plan_features_schema.js.map