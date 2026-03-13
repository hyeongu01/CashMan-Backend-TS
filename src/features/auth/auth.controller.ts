import type {Request, Response} from "express";
import {makeResponse} from "@common/CustomResponse";
import * as service from "./auth.service";
import {validateNaverLoginParams} from "@features/auth/auth.dto";

export const naverLogin = async (req: Request, res: Response) => {
    const params = req.query;
    if (!validateNaverLoginParams(params)) throw validateNaverLoginParams.errors;

    const data = await service.naverLogin(params);
    return res.status(200).json(makeResponse({data}));
};
