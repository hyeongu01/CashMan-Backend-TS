import logger from "@libs/logger";
import "dotenv/config";

interface Config {
    app: string;
    db: {
        url: string;
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    },
    redis: {
        url: string;
    },
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessExpiresIn: `${number}${"s" | "m" | "h" | "d"}`;
        accessExpiresMS: number;
        refreshExpiresIn: `${number}${"s" | "m" | "h" | "d"}`;
        refreshExpiresMS: number;
    },
    naver?: {
        clientId: string,
        clientSecret: string,
        redirectUri: string,
    }
}

const config: Config = {
    app: process.env.APP || "development",
    db: {
        url: process.env.DATABASE_URL || "mysql://root:1234@localhost:3306/myDB",
        host: process.env.DATABASE_HOST || "localhost",
        port: Number(process.env.DATABASE_PORT) || 3306,
        user: process.env.DATABASE_USER || "root",
        password: process.env.DATABASE_PASSWORD || "1234",
        database: process.env.DATABASE_NAME || "myDB"
    },
    redis: {
        url: process.env.REDIS_URL || "redis://:@localhost:6379",
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || "access secret",
        refreshSecret: process.env.JWT_REFRESH_SECRET || "refresh secret",
        accessExpiresIn: "1h",
        accessExpiresMS: 1000 * 3600,
        refreshExpiresIn: "7d",
        refreshExpiresMS: 1000 * 3600 * 24 * 7,
    }
}

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET)
    logger.warn("Jwt secret not defined");

if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET)
    config.naver = {
        clientId: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        redirectUri: process.env.NAVER_REDIRECT_URI || "http://localhost:3000/auth/naver/callback",
    };

export default config;
