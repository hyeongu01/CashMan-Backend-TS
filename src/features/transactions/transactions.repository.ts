import type {CreateTransactionParams, Transaction} from "./transactions.dto";
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
