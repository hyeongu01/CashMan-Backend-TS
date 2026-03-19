import type {
    CreateTransactionParams,
    Transaction,
    TransactionPaginationParams,
    UpdateTransactionParams
} from "./transactions.dto";
import {type User} from "@features/users/users.dto";
import prismaClient from "@config/db.config";
import {ulid} from "ulid";

export async function createTransaction(user: User, params: CreateTransactionParams): Promise<Transaction> {
    return prismaClient.transaction.create({
        data: {
            ...params,
            transactionDate: new Date(params.transactionDate),
            id: ulid(),
            userId: user.id,
        }
    })
}

export async function findAllMyTransactions(user: User, params: TransactionPaginationParams): Promise<[Transaction<["category"]>[], number]> {
    const {order, orderBy} = params
    const page = Number(params.page)
    const limit = Number(params.limit)

    const where = {
        userId: user.id,
        ...(params.categoryId && { categoryId: params.categoryId }),
        ...(params.fromAccountId && { fromAccountId: params.fromAccountId }),
        ...(params.toAccountId && { toAccountId: params.toAccountId }),
        ...((params.startDate || params.endDate) && {
            transactionDate: {
                ...(params.startDate && { gte: new Date(params.startDate) }),
                ...(params.endDate && { lte: new Date(params.endDate) }),
            }
        }),
    };

    return prismaClient.$transaction([
        prismaClient.transaction.findMany({
            where: where,
            include: {
                category: true,
            },
            orderBy: [
                {[orderBy]: (order) as "asc" | "desc"},
            ],
            skip: (page - 1) * limit,
            take: limit,
        }),
        prismaClient.transaction.count({
            where: where
        })
    ])
}

export async function findMyTransaction(user: User, transactionId: string): Promise<Transaction<["category"]> | null> {
    return prismaClient.transaction.findUnique({
        where: {
            id: transactionId,
            userId: user.id
        },
        include: {
            category: true,
        }
    })
}

export async function findTransactionById(transactionId: string): Promise<Transaction | null> {
    return prismaClient.transaction.findUnique({
        where: {id: transactionId},
    })
}

export async function updateTransaction(transactionId: string, params: UpdateTransactionParams): Promise<Transaction> {
    return prismaClient.transaction.update({
        where: {id: transactionId},
        data: {
            ...params,
            ...(params.transactionDate !== undefined && {transactionDate: new Date(params.transactionDate)}),
        },
    })
}

export async function deleteTransaction(transactionId: string): Promise<void> {
    await prismaClient.transaction.delete({
        where: {id: transactionId}
    })
}
