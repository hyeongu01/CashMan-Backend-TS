import {Category, CreateCategoryRequestBody, UpdateCategoryParams} from "@features/categories/categories.dto";
import prismaClient from "@config/db.config";
import {ulid} from "ulid";
import {customError} from "@common/CustomResponse";

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

export async function findCategoryById(categoryId: string): Promise<Category | null> {
    return prismaClient.category.findUnique({
        where: {id: categoryId},
    })
}

export async function findCategoryByUserId(params: UpdateCategoryParams & {userId: string}): Promise<Category | null> {
    const {name, groupType, userId} = params;
    if (name === undefined || groupType === undefined) return null;
    return prismaClient.category.findUnique({
        where: {
            userId_name_groupType: {
                name, groupType, userId
            }
        },
    })
}

export async function updateCategory(categoryId: string, params: UpdateCategoryParams): Promise<Category> {
    return prismaClient.category.update({
        where: {id: categoryId},
        data: params
    })
}

export async function deleteCategory(categoryId: string): Promise<void> {
    await prismaClient.category.delete({
        where: {id: categoryId}
    })
}

