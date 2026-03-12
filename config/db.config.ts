import config from "./config";
import {PrismaClient} from "@generated/prisma/client";
import {PrismaMariaDb} from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
    host: config.db.host,
    user: config.db.user,
    port: config.db.port,
    password: config.db.password,
    database: config.db.database,
    connectionLimit: 5,
});
const prismaClient = new PrismaClient({adapter});

export default prismaClient;
