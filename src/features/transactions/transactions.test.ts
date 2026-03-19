import {describe, test, expect, vi, beforeAll} from "vitest";
import * as repository from "./transactions.repository";
import * as service  from "./transactions.service";
import {type User} from "@features/users/users.dto";
import {findCategoryById} from "@features/categories/categories.repository";
import {TransactionPaginationParams} from "@features/transactions/transactions.dto";
import {getAccountById} from "@features/accounts/accounts.repository";

vi.mock('./transactions.repository');
vi.mock("../categories/categories.repository");

describe("service", () => {
    const mockUser: User = {
        id: "test-user-1",
        name: "test-user-1-name",
        timezone: "Asia/Seoul",
        currency: "KRW",
        birthDate: null,
        createdAt: new Date(),
        deletedAt: null,
    }
    const mockParams: TransactionPaginationParams = {
        page: "1",
        limit: "5",
        order: "asc",
        orderBy: "createdAt",
    }


    test("[findAllMyTransactions] category not found", async () => {
        vi.mocked(findCategoryById).mockResolvedValue(null);
        await expect(
            service.findAllMyTransactions(mockUser, {...mockParams, categoryId: "set"})
        ).rejects.toMatchObject({statusCode: 404, error: {message: "category not found"}})
    })

    test("[findAllMyTransactions] return format", async () => {
        vi.mocked(repository.findAllMyTransactions).mockResolvedValue([
            [
                {
                    id: "tx-1",
                    userId: mockUser.id,
                    type: 1,
                    categoryId: "cat-1",
                    fromAccountId: null,
                    toAccountId: null,
                    amount: BigInt(10000),
                    currency: "KRW",
                    transactionDate: new Date("2026-03-19"),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    category: {
                        id: "cat-1",
                        userId: mockUser.id,
                        name: "식비",
                        groupType: 1,
                    },
                },
            ],
            1,
        ])

        const result = await service.findAllMyTransactions(mockUser, mockParams);
        expect(repository.findAllMyTransactions).toHaveBeenCalledWith(mockUser, mockParams);
        expect(result).toEqual(expect.objectContaining({
            data: expect.arrayContaining([
                expect.objectContaining({transactionDate: "2026-03-19"})
            ]),
            meta: expect.objectContaining({totalCount: 1, count: 1})
        }))
        expect(result.data).toHaveLength(1)
    })


})
