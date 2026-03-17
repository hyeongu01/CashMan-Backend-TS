import type {Request, Response} from "express";
import {User, validateUpdateUserParamsSchema} from "./users.dto";
import {customError, makeResponse} from "@common/CustomResponse";
import {userConverter} from "@features/users/users.converter";
import * as service from "./users.service";
import * as repository from "./users.repository";

export async function getMyProfile(req: Request, res: Response): Promise<any> {
    const user = req.user as User;
    return res.status(200).send(makeResponse({data: userConverter(user)}));
}

export async function updateMyProfile(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const params = req.body;

    if (!user) throw customError.UNAUTHORIZED();
    if (!validateUpdateUserParamsSchema(params)) throw customError.BAD_REQUEST("request body invalid");

    const data: User = await repository.updateUser(user, params);

    return res.status(200).json(makeResponse({data}));
}

export async function deleteMyProfile(req: Request, res: Response): Promise<any> {
    const user = req.user;
    if (!user) throw customError.UNAUTHORIZED();

    await repository.softDeleteUser(user.id);
    return res.status(200).json(makeResponse({}));
}
