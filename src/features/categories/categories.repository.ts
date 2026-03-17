import {Category, CreateCategoryRequestBody} from "@features/categories/categories.dto";
import prismaClient from "@config/db.config";
import {ulid} from "ulid";

export async function createCategory(userId: string, params: CreateCategoryRequestBody): Promise<Category> {
    return prismaClient.category.create({
        data: {
            id: ulid(),
            userId,
            ...params
        }
    })
}

export async function findCategories(userId: string, groupType?: number): Promise<Category[]> {
    return prismaClient.category.findMany({
        where: {
            userId,
            groupType: groupType,
        },
        orderBy: [
            {groupType: 'asc'},
            {name: "asc"}
        ]
    })
}

