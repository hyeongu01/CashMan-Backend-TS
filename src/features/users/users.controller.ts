import type {Request, Response} from "express";
import {User, validateUpdateUserParamsSchema} from "./users.dto";
import {customError, makeResponse} from "@common/CustomResponse";
import {userConverter} from "@features/users/users.converter";

export async function getMyProfile(req: Request, res: Response): Promise<any> {
    const user = req.user as User;
    return res.status(200).send(makeResponse({data: userConverter(user)}));
}

export async function updateMyProfile(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const params = req.body;

    if (!validateUpdateUserParamsSchema(params)) throw customError.BAD_REQUEST("reqeust body invalid");

    if (!user) throw customError.UNAUTHORIZED();



}
