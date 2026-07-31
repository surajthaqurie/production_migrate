"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable("people_companies")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo((0, kysely_1.sql) `gen_random_uuid()`))
        .addColumn("personId", "uuid", (col) => col.notNull().references("people_management.id").onDelete("cascade"))
        .addColumn("name", "varchar(100)", (col) => col.notNull())
        .addColumn("position", "varchar(50)", (col) => col.notNull())
        .addColumn("employeeCount", "integer")
        .addColumn("businessType", "varchar(50)")
        .addColumn("websiteURL", "text")
        .addColumn("location", "varchar(255)")
        .addColumn("state", "varchar(255)")
        .addColumn("city", "varchar(255)")
        .addColumn("zipCode", "varchar(20)")
        .addColumn("createdAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .addColumn("updatedAt", "timestamptz", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
        .execute();
    await db.schema.createIndex("idx_people_companies_person_id").on("people_companies").column("personId").execute();
    await db.schema.createIndex("idx_people_companies_business_type").on("people_companies").column("businessType").execute();
    await db.schema.createIndex("idx_people_companies_created_at").on("people_companies").column("createdAt").execute();
    await db.schema.createIndex("idx_people_companies_name").on("people_companies").column("name").execute();
    await db.schema.createIndex("idx_people_companies_state").on("people_companies").column("state").execute();
    await db.schema.createIndex("idx_people_companies_city").on("people_companies").column("city").execute();
}
async function down(db) {
    await db.schema.dropIndex("idx_people_companies_city").ifExists().execute();
    await db.schema.dropIndex("idx_people_companies_state").ifExists().execute();
    await db.schema.dropIndex("idx_people_companies_name").ifExists().execute();
    await db.schema.dropIndex("idx_people_companies_created_at").ifExists().execute();
    await db.schema.dropIndex("idx_people_companies_business_type").ifExists().execute();
    await db.schema.dropIndex("idx_people_companies_person_id").ifExists().execute();
    await db.schema.dropTable("people_companies").ifExists().execute();
}
//# sourceMappingURL=1780301895560_create_people_companies_schema.js.map