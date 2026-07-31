import { Kysely } from "kysely";
import { DB } from "src/tenant-db.interface";
export declare function skip_up(db: Kysely<DB>): Promise<void>;
export declare function skip_down(db: Kysely<DB>): Promise<void>;
