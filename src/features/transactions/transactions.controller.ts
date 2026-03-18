import type {Request, Response} from "express";
import {customError, makeResponse} from "@common/CustomResponse";
import {validateTransactionParams, type Transaction} from "@features/transactions/transactions.dto";
import * as repository from "./transactions.repository";
import * as service from "./transactions.service";
import {transactionConverter} from "@features/transactions/transactions.converter";


export async function createTransaction(req: Request, res: Response) {
    const user = req.user;
    const raw = req.body;

    if (!user) throw customError.UNAUTHORIZED();
    if (!validateTransactionParams(raw)) throw validateTransactionParams.errors;

    const data: Transaction = await service.createTransaction(user, req.body);
    return res.status(200).json(makeResponse({data: transactionConverter(data)}));
}
