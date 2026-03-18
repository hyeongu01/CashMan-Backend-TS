import {initializeDBModel} from "@libs/model";
import logger from "@libs/logger";
import app from "./app";
import redisClient from "@libs/redis";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/client";
import "@common/types/global";

async function main() {
    try {
        await initializeDBModel();
        await redisClient.connect();

        app.listen(3000, () => {
            logger.info(`server is running!`);
        })
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) logger.error(`[prisma] ${error.message}`);
        else logger.error(error);
        process.exit(1);
    }
}

main();
