import {user} from "@generated/prisma/client";

export type User = user;

export type ResponseUser = {
    id: string;
    name: string;
    timezone: string;
    currency: string;
    birthDate?: string;
    createdAt: string;
}
