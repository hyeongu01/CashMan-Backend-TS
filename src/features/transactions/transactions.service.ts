import {
    type CreateTransactionParams,
    type Transaction,
    type TransactionPaginationParams
} from "@features/transactions/transactions.dto";
import {type User} from "@features/users/users.dto";
import {findCategoryById} from "@features/categories/categories.repository";
import {getAccountById} from "@features/accounts/accounts.repository";
import {customError} from "@common/CustomResponse";
import * as repository from "./transactions.repository";
import {transactionConverter} from "@features/transactions/transactions.converter";

export async function createTransaction(user: User, params: CreateTransactionParams): Promise<Transaction> {
    const {categoryId, fromAccountId, toAccountId} = params;

    const category = categoryId ? await findCategoryById(categoryId) : null;
    const fromAccount = fromAccountId ? await getAccountById(fromAccountId) : null;
    const toAccount = toAccountId ? await getAccountById(toAccountId) : null;

    if (categoryId && !category) throw customError.NOT_FOUND("category is not found");
    if (fromAccountId && !fromAccount) throw customError.NOT_FOUND("fromAccount is not found");
    if (toAccountId && !toAccount) throw customError.NOT_FOUND("toAccount is not found");

    return repository.createTransaction(user, params);
}

export async function findAllMyTransactions(user: User, params: TransactionPaginationParams): Promise<any> {
    const {categoryId, fromAccountId, toAccountId} = params;



    const category = categoryId ? await findCategoryById(categoryId) : null;
    const fromAccount = fromAccountId ? await getAccountById(fromAccountId) : null;
    const toAccount = toAccountId ? await getAccountById(toAccountId) : null;

    if (categoryId && !category) return [];
    if (fromAccountId && !fromAccount) return [];
    if (toAccountId && !toAccount) return [];

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
