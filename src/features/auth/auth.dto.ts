// import * as z from "zod";
import {ajv, type JSONSchemaType, type ValidateFunction} from "@libs/ajv";


// 네이버 로그인 서비스 파라메터
export type NaverLoginParams = {
    code: string,
    state: string,
}
export const NaverLoginParamsSchema: JSONSchemaType<NaverLoginParams> = {
    type: 'object',
    properties: {
        code: {type: "string"},
        state: {type: "string"},
    },
    required: ["code", "state"],
    additionalProperties: false,
}
export const validateNaverLoginParams: ValidateFunction<NaverLoginParams> = ajv.compile(NaverLoginParamsSchema);


// 로그인 결과 response
export type LoginResponse = {
    accessToken: string,
    refreshToken: string,
}


// 네이버 프로필 스키마
export type NaverProfile = {
    id: string,
    name: string,
    birthday: string,
    birthyear: string,
}
export const NaverProfileSchema: JSONSchemaType<NaverProfile> = {
    type: 'object',
    properties: {
        id: {type: 'string'},
        name: {type: 'string'},
        birthday: {type: 'string'},
        birthyear: {type: 'string'},
    },
    required: ["id", "name", "birthday", "birthyear"],
}
export const validateNaverProfile: ValidateFunction<NaverProfile> = ajv.compile(NaverProfileSchema);

// 로그인 파라메터
export type LoginParams = {
    provider: string,
    providerId: string,
    name: string,
    birthDate?: string,
}
export const LoginParamsSchema: JSONSchemaType<LoginParams> = {
    type: 'object',
    properties: {
        provider: {type: 'string'},
        providerId: {type: 'string'},
        name: {type: 'string'},
        birthDate: {
            type: 'string',
            format: "date",
            nullable: true,
        }
    },
    required: ["provider", "providerId", "name"],
}


export type CreateUserParams = {
    timezone?: string,
    currency?: string,
} & LoginParams;
export const CreateUserParamsSchema: JSONSchemaType<CreateUserParams> = {
    type: 'object',
    properties: {
        provider: {type: 'string'},
        providerId: {type: 'string'},
        name: {type: 'string'},
        birthDate: {
            type: 'string',
            format: "date",
            nullable: true,
        },
        timezone: {type: 'string', nullable: true},
        currency: {type: 'string', nullable: true},
    },
    required: ["provider", "providerId", "name"],
}


