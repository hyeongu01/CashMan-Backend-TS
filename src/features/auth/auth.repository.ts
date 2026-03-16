import prismaClient from "@config/db.config";
import {User} from "@features/users/users.dto";
import {CreateUserParams} from "./auth.dto";
import {ulid} from "ulid"
import {AccountType, CurrencyCode} from "@common/type";
import config from "@config/config";

export const getUserById = async (id: string): Promise<User | null> => {
    return prismaClient.user.findUnique({where: {id: id, deletedAt: null}});
}

export const getUserByProvider = async (provider: string, providerId: string): Promise<User | null> => {
    const result = await prismaClient.user_auth.findFirst({
        where: {
            provider,
            providerId,
            user: {
                deletedAt: null,
            }
        },
        select: {
            user: true,
        }
    });
    return result ? result.user : null;
}

export const createUser = async (params: CreateUserParams): Promise<User> => {
    const {provider, providerId, birthDate, ...body} = params;
    return prismaClient.user.create({
        data: {
            id: ulid(),
            ...body,
            birthDate: birthDate ? new Date(birthDate) : undefined,
            auths: {
                create: {
                    provider,
                    providerId,
                }
            },
            accounts: {
                createMany: {
                    data: [
                        {
                            id: ulid(),
                            groupType: AccountType.DEFAULT,
                            currency: body.currency ?? CurrencyCode.KRW,
                        },
                        {
                            id: ulid(),
                            groupType: AccountType.DEPOSIT,
                            currency: body.currency ?? CurrencyCode.KRW,
                        },
                        {
                            id: ulid(),
                            groupType: AccountType.INVESTMENT,
                            currency: body.currency ?? CurrencyCode.KRW,
                        },
                    ]
                }
            }
        }
    });
}

export const createRefreshToken = async (userId: string, token: string, deviceId: string): Promise<void> => {
    await prismaClient.refresh_token.upsert({
        create: {
            token,
            deviceId,
            expiresAt: new Date(Date.now() + config.jwt.refreshExpiresMS),
            userId: userId,
        },
        where: {
            userId_deviceId: {userId, deviceId},
        },
        update: {
            token,
            expiresAt: new Date(Date.now() + config.jwt.refreshExpiresMS),
        }
    })
}

export const logoutUser = async (params: {userId: string, hashedToken: string, deviceId: string}) => {
    const {hashedToken: token, ...body} = params;
    await prismaClient.refresh_token.update({
        where: {
            userId_deviceId: body,
            token,
        },
        data: {
            revokedAt: new Date(Date.now())
        }
    })
}
