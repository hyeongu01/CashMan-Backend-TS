import config from "@config/config";
import prismaClient from "@config/db.config";
import logger from "@libs/logger";


export async function initializeDBModel() {
    logger.info(`[DB] Connecting to DB: ${config.db.host}:${config.db.port}`);
    await prismaClient.$connect();
    logger.info("[DB] Initialized DBModel");
}
