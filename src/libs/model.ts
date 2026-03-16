import config from "@config/config";
import prismaClient from "@config/db.config";
import logger from "@libs/logger";


export async function initializeDBModel() {
    logger.info(`[DB] Connecting to DB: \x1b[34m${config.db.host}:${config.db.port}\x1b[0m`);
    await prismaClient.$connect();
    await prismaClient.$queryRawUnsafe("SELECT 1");
    logger.info("[DB] Initialized DBModel");
}
