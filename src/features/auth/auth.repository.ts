import prismaClient from "@config/db.config";
import {User} from "@features/users/users.dto";
import {CreateUserParams} from "./auth.dto";
import {ulid} from "ulid"
import {AccountType, CurrencyCode} from "@common/type";
import config from "@config/config";

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
    const {provider, providerId, ...body} = params;
    return prismaClient.user.create({
        data: {
            id: ulid(),
            ...body,
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
                            type: AccountType.DEFAULT,
                            currency: CurrencyCode.KRW,
                        },
                        {
                            id: ulid(),
                            type: AccountType.DEPOSIT,
                            currency: CurrencyCode.KRW,
                        },
                        {
                            id: ulid(),
                            type: AccountType.INVESTMENT,
                            currency: CurrencyCode.KRW,
                        },
                    ]
                }
            }
        }
    });
}

export const createRefreshToken = async (userId: string, token: string, deviceId: string): Promise<void> => {
    await prismaClient.refresh_token.create({
        data: {
            token,
            deviceId,
            expiresAt: new Date(Date.now() + config.jwt.refreshExpiresMS),
            userId: userId,
        }
    })
}
