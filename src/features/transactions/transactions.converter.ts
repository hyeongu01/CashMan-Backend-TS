import {Transaction} from "@features/transactions/transactions.dto";

export const transactionConverter = (transaction: Transaction) => {
    return {
        ...transaction,
        transactionDate: transaction.transactionDate.toISOString().split('T')[0],
    }
}
