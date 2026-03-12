import type {Request, Response} from "express";
import {customError, makeResponse} from "@common/CustomResponse";
import * as service from "./auth.service";
import {NaverLoginParamsSchema} from "@features/auth/auth.dto";

export const naverLogin = async (req: Request, res: Response) => {
    const result = NaverLoginParamsSchema.safeParse(req.query);
    if (!result.success) throw customError.BAD_REQUEST();

    const data = await service.naverLogin(result.data);
    return res.status(200).json(makeResponse({data}));
}
