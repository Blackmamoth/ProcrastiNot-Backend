import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { GlobalConfig } from "../config/environment";
import { sql } from "drizzle-orm";
import LOGGER from "../config/logger";

export const db = drizzle(GlobalConfig.DATABASE_URL!);

(async () => {
  const ping = await db.execute(sql`SELECT 1`);
  if (ping.rows.length !== 0) {
    LOGGER.info("Application connected to PostgreSQL server");
    return;
  }
  LOGGER.fatal("Application disconnected from PostgreSQL server");
})();
