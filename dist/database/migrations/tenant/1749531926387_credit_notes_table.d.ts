import { type Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";
export declare function up(db: Kysely<DB>): Promise<void>;
export declare function down(db: Kysely<DB>): Promise<void>;
