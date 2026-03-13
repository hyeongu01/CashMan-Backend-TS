import type {Request, Response} from "express";
import type {User} from "./users.dto";
import {makeResponse} from "@common/CustomResponse";
import {userConverter} from "@features/users/users.converter";

export async function getMyProfile(req: Request, res: Response): Promise<any> {
    const user = req.user as User;
    return res.status(200).send(makeResponse({data: userConverter(user)}));
}

export async function updateMyProfile(req: Request, res: Response): Promise<any> {
    const user = req.user as User;
    // const result =

}
