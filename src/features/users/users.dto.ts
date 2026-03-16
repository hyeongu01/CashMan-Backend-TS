import {user} from "@generated/prisma/client";
import {JSONSchemaType, ajv, ValidateFunction} from "@libs/ajv";
// import * as z from "zod";

export type User = user;

export type ResponseUser = Pick<User,
    "id" | "name" | "timezone" | "currency"
> & {
    birthDate?: string,
    createdAt: string,
}

export type UpdateUserParams = {
    name?: string,
    timezone?: string,
    currency?: string,
    birthDate?: string,
}
export const UpdateUserParamsSchema: JSONSchemaType<UpdateUserParams> = {
    type: "object",
    properties: {
        name: {type: 'string', nullable: true},
        timezone: {type: 'string', nullable: true},
        currency: {type: 'string', nullable: true},
        birthDate: {
            type: 'string',
            format: 'date',
            nullable: true
        },
    }
}
export const validateUpdateUserParamsSchema: ValidateFunction<UpdateUserParams> = ajv.compile(UpdateUserParamsSchema);
