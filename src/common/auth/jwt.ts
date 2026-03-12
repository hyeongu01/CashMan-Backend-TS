import config from "@config/config";
import jwt, {type JwtPayload} from "jsonwebtoken";
const {sign, verify} = jwt;
import {type LoginResponse} from "@features/auth/auth.dto";


export interface CustomJwtPayload extends JwtPayload {
    id: string;
    deviceId?: string;
}

export const encodeJWT = (userId: string, deviceId: string): LoginResponse => {
    return {
        accessToken: sign(
            {id: userId},
            config.jwt.accessSecret,
            {algorithm: "HS256", expiresIn: config.jwt.accessExpiresIn}
        ),
        refreshToken: sign(
            {id: userId, deviceId},
            config.jwt.refreshSecret,
            {algorithm: "HS256", expiresIn: config.jwt.refreshExpiresIn},
        )
    }
}

export const decodeJWT = (token: string, isAccessToken: boolean = true): CustomJwtPayload | null => {
    try {
        return verify(
            token,
            isAccessToken ? config.jwt.accessSecret : config.jwt.refreshSecret,
            {algorithms: ["HS256"]}
        ) as CustomJwtPayload;
    } catch { return null; }
}
