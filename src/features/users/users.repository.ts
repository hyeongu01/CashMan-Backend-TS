import {User, UpdateUserParams} from "@features/users/users.dto";
import prismaClient from "@config/db.config";
import {customError} from "@common/CustomResponse";

export const getUserById = async (id: string): Promise<User | null> => {
    return prismaClient.user.findUnique({where: {id: id, deletedAt: null}});
}

export async function updateUser(user: User, params: UpdateUserParams): Promise<User> {
    return prismaClient.$transaction(async (tx): Promise<User> => {
        const originalUser: User | null = await tx.user.findUnique({
            where: {id: user.id, deletedAt: null},
        });

        if (!originalUser) throw customError.NOT_FOUND("user not found");

        return tx.user.update({
            where: {id: originalUser.id, deletedAt: null},
            data: {
                ...params,
                birthDate: params.birthDate ? new Date(params.birthDate) : undefined,
            },
        })
    })
}
