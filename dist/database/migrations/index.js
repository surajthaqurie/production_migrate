"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateToLatest = void 0;
const fs_1 = require("fs");
const path = require("path");
const kysely_1 = require("kysely");
const migrateToLatest = async (db) => {
    const migrator = new kysely_1.Migrator({
        db,
        provider: new kysely_1.FileMigrationProvider({ fs: fs_1.promises, path, migrationFolder: path.join(__dirname, ".") }),
        allowUnorderedMigrations: false
    });
    const { error, results } = await migrator.migrateToLatest();
    if (error) {
        throw new Error("Database migration failed");
    }
    results?.forEach(({ migrationName, status }) => {
        console.log(`Migration "${migrationName}" ${status === "Success" ? "executed successfully" : "failed"}.`);
    });
    await db.destroy();
};
exports.migrateToLatest = migrateToLatest;
//# sourceMappingURL=index.js.map