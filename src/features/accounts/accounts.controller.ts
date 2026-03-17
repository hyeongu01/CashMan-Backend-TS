import {User} from "@features/users/users.dto";
import {Request, Response} from "express";
import {customError, makeResponse} from "@common/CustomResponse";
import {Account} from "@features/accounts/accounts.dto";
import * as repository from "./accounts.repository";

export async function getAllMyAccounts(req: Request, res: Response): Promise<any> {
    const user: User | undefined = req.user;
    const currency: string | undefined = typeof req.query.currency === "string" ? req.query.currency : undefined;
    if (!user) throw customError.UNAUTHORIZED();

    const data: Account[] = await repository.getAllAccounts(user, currency);
    return res.status(200).json(makeResponse({data}));
}
