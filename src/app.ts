import express from "express";
import morgan from "morgan";
import type {Request, Response, NextFunction} from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "@libs/swagger";
import router from "./features";
import {customError, validateCustomErrorSchema} from "@common/CustomResponse";
import logger from "@libs/logger";
import {Prisma} from "@generated/prisma/client";
import cors from "cors";


const app = express();
app.use(cors({
    origin: "*",
    allowedHeaders: ["*"]
}));

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(morgan("dev", {stream: {write: (message) => logger.http(message.replace(/\x1b\[\d+m/g, '').trim())}}));

app.use("/", router);

app.get("/health", (_req: Request, res: Response) => {
    return res.status(200).send("Server is running");
})

// 에러 핸들링
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (validateCustomErrorSchema(err)) {               // 사용자 지정 표준 에러
        const {statusCode, ...body} = err;
        logger.error(`${body.error.code} ${body.error.message}`);
        return res.status(statusCode).json(body);
    }
    if (Array.isArray(err) && err[0]?.keyword) {        // ajv 타입 에러
        const details = err.map(e => ({
            field: e.instancePath || String(e.params?.missingProperty),
            message: e.message || "invalid",
        }));
        const { statusCode, ...body } = customError.BAD_REQUEST('Validation failed');
        body.error.detail = details;
        return res.status(statusCode).json(body);
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        logger.error(`[Prisma] ${err.code}: ${err.message}`);
        const { statusCode, ...body } = customError.SERVER_ERROR();
        return res.status(statusCode).json(body);
    }

    // 모르는 error
    logger.error(err);
    const { statusCode, ...body } = customError.SERVER_ERROR();
    return res.status(statusCode).json(body);
})

export default app;
