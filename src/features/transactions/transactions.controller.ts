import type {Request, Response} from "express";
import {customError, makeResponse} from "@common/CustomResponse";
import {
    validateTransactionParams,
    type Transaction,
    TransactionPaginationParams, validateTransactionPaginationParams, validateUpdateTransactionParams
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
    paginationParams.order = typeof paginationParams.order === "string" ? paginationParams.order.toLowerCase() : paginationParams.order;
    paginationParams.page = paginationParams.page ?? "1";
    paginationParams.limit = paginationParams.limit ?? "10";
    paginationParams.orderBy = paginationParams.orderBy ?? "transactionDate";

    if (!user) throw customError.UNAUTHORIZED();
    if (!validateTransactionPaginationParams(paginationParams)) throw validateTransactionPaginationParams.errors;

    const params = await service.findAllMyTransactions(user, paginationParams);
    return res.status(200).json(makeResponse(params));
}

export async function findMyTransaction(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const transactionId = req.params.transactionId;

    if (!user) throw customError.UNAUTHORIZED();
    if (typeof transactionId !== "string") throw customError.BAD_REQUEST();

    const data: Transaction<["category"]> | null = await repository.findMyTransaction(user, transactionId);
    if (!data) throw customError.NOT_FOUND();
    return res.status(200).json(makeResponse({
        data: transactionConverter(data)
    }));
}

export async function updateMyTransaction(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const transactionId = req.params.transactionId;
    const params = req.body;

    if (!user) throw customError.UNAUTHORIZED();
    if (!validateUpdateTransactionParams(params)) throw validateUpdateTransactionParams.errors;
    if (typeof transactionId !== "string") throw customError.BAD_REQUEST();

    const data: Transaction = await service.updateTransaction(user, transactionId, params);
    return res.status(200).json(makeResponse({data: transactionConverter(data)}));
}

export async function deleteMyTransaction(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const transactionId = req.params.transactionId;

    if (!user) throw customError.UNAUTHORIZED();
    if (typeof transactionId !== "string") throw customError.BAD_REQUEST();

    await service.deleteTransaction(user, transactionId);
    return res.status(200).json(makeResponse({}))
}
