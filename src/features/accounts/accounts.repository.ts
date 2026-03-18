import {Account} from "@features/accounts/accounts.dto";
import prismaClient from "@config/db.config";
import {User} from "@features/users/users.dto";

export async function getAllAccounts(user: User, currency?: string): Promise<Account[]> {
     return prismaClient.account.findMany({
        where: {
            userId: user.id,
            currency: currency ?? user.currency,
        }
    })
}

export async function getAccountById(accountId: string) {
    return prismaClient.account.findUnique({
        where: {id: accountId },
    })
}
