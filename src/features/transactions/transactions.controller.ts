import type {Request, Response} from "express";
import {customError, makeResponse} from "@common/CustomResponse";
import {
    validateTransactionParams,
    type Transaction,
    TransactionPaginationParams, validateTransactionPaginationParams
} from "@features/transactions/transactions.dto";
import * as repository from "./transactions.repository";
import * as service from "./transactions.service";
import {transactionConverter} from "@features/transactions/transactions.converter";


export async function createTransaction(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const raw = req.body;

    if (!user) throw customError.UNAUTHORIZED();
    if (!validateTransactionParams(raw)) throw validateTransactionParams.errors;

    const data: Transaction = await service.createTransaction(user, req.body);
    return res.status(200).json(makeResponse({data: transactionConverter(data)}));
}

export async function findAllMyTransactions(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const paginationParams = req.query;
    paginationParams.order = typeof paginationParams.order === "string" ? paginationParams.order.toLowerCase() : undefined;
    paginationParams.page = paginationParams.page ?? "1";
    paginationParams.limit = paginationParams.limit ?? "10";
    paginationParams.orderBy = paginationParams.orderBy ?? "transactionDate";

    if (!user) throw customError.UNAUTHORIZED();
    if (!validateTransactionPaginationParams(paginationParams)) throw validateTransactionPaginationParams.errors;

    const params = await service.findAllMyTransactions(user, paginationParams);
    return res.status(200).json(makeResponse(params));
}
