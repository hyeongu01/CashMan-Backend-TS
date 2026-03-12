import {createClient} from 'redis';
import config from '@config/config';
import logger from "@libs/logger";

const client = createClient({url: config.redis.url})
    .on("connect", (): void => {
        logger.info(`[redis] connecting to \x1b[34m${config.redis.url}\x1b[0m`);
    }).on("error", (err): void => {
        logger.error(`[redis] error: ${err}`);
        process.exit(1);
    });

export default client;