import {describe, test, expect, vi} from "vitest";
import * as repository from "./transactions.repository";
import * as service  from "./transactions.service";
import {type User} from "@features/users/users.dto";
import {findCategoryById} from "@features/categories/categories.repository";
import {TransactionPaginationParams} from "@features/transactions/transactions.dto";

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

    test("[GET /transactions] category not found", async () => {
        vi.mocked(findCategoryById).mockResolvedValue(null);
        await expect(
            service.findAllMyTransactions(mockUser, {...mockParams, categoryId: "set"})
        ).rejects.toMatchObject({statusCode: 404, error: {message: "category not found"}})
    })

    test("[GET /transactions] return format", async () => {

    })
})
