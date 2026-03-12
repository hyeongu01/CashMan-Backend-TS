import express from "express";
import type {Request, Response, NextFunction} from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "@libs/swagger";
import router from "./features";
import {CustomErrorSchema, customError} from "@common/CustomResponse";
import logger from "@libs/logger";


const app = express();
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", router);

app.get("/health", (_req: Request, res: Response) => {
    return res.status(200).send("Server is running");
})

// 에러 핸들링
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const result = CustomErrorSchema.safeParse(err);
    if (!result.success) {
        logger.error(err);
        const { statusCode, ...body } = customError.SERVER_ERROR();
        return res.status(statusCode).json(body);
    }
    const { statusCode, ...body } = result.data;
    return res.status(statusCode).json(body);
})

export default app;
