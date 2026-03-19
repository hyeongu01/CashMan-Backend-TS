import {
    type CreateTransactionParams,
    type Transaction,
    type TransactionPaginationParams, UpdateTransactionParams
} from "@features/transactions/transactions.dto";
import {type User} from "@features/users/users.dto";
import {findCategoryById} from "@features/categories/categories.repository";
import {getAccountById} from "@features/accounts/accounts.repository";
import {customError} from "@common/CustomResponse";
import * as repository from "./transactions.repository";
import {transactionConverter} from "@features/transactions/transactions.converter";

async function validateRelations(params: {categoryId?: string, fromAccountId?: string, toAccountId?: string}) {
    const {categoryId, fromAccountId, toAccountId} = params;

    const category = categoryId ? await findCategoryById(categoryId) : null;
    const fromAccount = fromAccountId ? await getAccountById(fromAccountId) : null;
    const toAccount = toAccountId ? await getAccountById(toAccountId) : null;

    if (categoryId && !category) throw customError.NOT_FOUND("category is not found");
    if (fromAccountId && !fromAccount) throw customError.NOT_FOUND("fromAccount is not found");
    if (toAccountId && !toAccount) throw customError.NOT_FOUND("toAccount is not found");
}

export async function createTransaction(user: User, params: CreateTransactionParams): Promise<Transaction> {
    await validateRelations(params);

    return repository.createTransaction(user, params);
}

export async function findAllMyTransactions(user: User, params: TransactionPaginationParams): Promise<{data: object, meta: object}> {
    await validateRelations(params);

    const [data, totalCount]: [Transaction<["category"]>[], number] = await repository.findAllMyTransactions(user, params);
    return {
        data: data.map(d => transactionConverter(d)),
        meta: {
            ...params,
            count: data.length,
            totalCount,
        }
    }
}

export async function updateTransaction(user: User, transactionId: string, params: UpdateTransactionParams): Promise<Transaction> {
    const oldTransaction: Transaction | null = await repository.findTransactionById(transactionId);

    if (!oldTransaction) throw customError.NOT_FOUND("transaction not found");
    if (oldTransaction.userId !== user.id) throw customError.NOT_FOUND("transaction not found");
    await validateRelations(params);
    console.log(oldTransaction)

    return repository.updateTransaction(transactionId, params);
}

export async function deleteTransaction(user: User, transactionId: string): Promise<void> {
    const oldTransaction: Transaction | null = await repository.findTransactionById(transactionId);

    if (!oldTransaction) throw customError.NOT_FOUND("transaction not found");
    if (oldTransaction.userId !== user.id) throw customError.NOT_FOUND("transaction not found");

    await repository.deleteTransaction(transactionId);
}
