import { promises as fs } from "fs";
import * as path from "path";
import { FileMigrationProvider, Kysely, Migrator } from "kysely";
import { DB } from "src/tenant-db.interface";

export const migrateToLatest = async (db: Kysely<DB>): Promise<void> => {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({ fs, path, migrationFolder: path.join(__dirname, ".") }),
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
