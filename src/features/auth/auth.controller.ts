import type {Request, Response} from "express";
import {customError, makeResponse} from "@common/CustomResponse";
import * as service from "./auth.service";
import {validateNaverLoginParams} from "@features/auth/auth.dto";
import {User} from "@features/users/users.dto";
import {decodeJWT} from "@common/auth/jwt";
import {generateNaverLoginURL} from "@common/auth/naverLogin";

export const naverLogin = async (req: Request, res: Response) => {
    const params = req.query;
    if (!validateNaverLoginParams(params)) throw validateNaverLoginParams.errors;

    const data = await service.naverLogin(params);
    return res.status(200).json(makeResponse({data}));
};

export const naverRedirect = async (req: Request, res: Response) => {
    const naverLoginUrl = await generateNaverLoginURL();
    return res.status(302).setHeader('Location', naverLoginUrl).end();
}

export const logout = async (req: Request, res: Response) => {
    const user = req.user;
    const {refreshToken} = req.body;

    if (!refreshToken) throw customError.BAD_REQUEST("refreshToken is required");
    if (!user) throw customError.UNAUTHORIZED();

    await service.logout(user, {refreshToken});

    return res.status(200).end();
}

export const refresh = async (req: Request, res: Response) => {
    const {refreshToken} = req.body;
    if (!refreshToken) throw customError.BAD_REQUEST("refreshToken is required");

    const data = await service.refresh({refreshToken});
    return res.status(200).json(makeResponse({data}));
}
