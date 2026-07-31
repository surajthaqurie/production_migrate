import { Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";
export declare const migrateToLatest: (db: Kysely<DB>) => Promise<void>;
