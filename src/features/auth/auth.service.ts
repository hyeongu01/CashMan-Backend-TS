import config from "@config/config";
import {
    type NaverLoginParams,
    type LoginResponse,
    type LoginParams,
    validateNaverProfile,
} from "@features/auth/auth.dto";
import {customError} from "@common/CustomResponse";
import axios from "axios";
import * as repository from "./auth.repository";
import {getUserById} from "@features/users/users.repository";
import {AuthProvider} from "@common/type";
import {User} from "@features/users/users.dto";
import {decodeJWT, encodeJWT} from "@common/auth/jwt";
import {ulid} from "ulid";
import {createHash} from "crypto";
import prismaClient from "@config/db.config";
import redis from "@libs/redis";

export const naverLogin = async (params: NaverLoginParams): Promise<LoginResponse> => {
    // code, state 분리
    const {code, state} = params;

    if (!config.naver) throw customError.SERVER_ERROR();

    // redis 에서 state 검증하는 코드 추가
    const exists = await redis.del(`naverLoginState:${state}`);
    if (!exists) throw customError.UNAUTHORIZED("state is not valid");

    // access_token 발급 (네이버 서버 jwt)
    const tokenResult = await axios.get("https://nid.naver.com/oauth2.0/token", {
        params: {
            grant_type: "authorization_code",
            client_id: config.naver.clientId,
            client_secret: config.naver.clientSecret,
            redirect_uri: config.naver.redirectUri,
            code,
            state,
        }
    });
    const {access_token, token_type} = tokenResult.data;
    if (!access_token || !token_type) throw customError.SERVER_ERROR("네이버 토큰 발급 실패");

    // profile 조회
    const profileResult = await axios.get("https://openapi.naver.com/v1/nid/me", {
        headers: {
            Authorization: `${token_type} ${access_token}`,
        }
    });
    const profile = profileResult.data.response;
    if (!validateNaverProfile(profile)) throw validateNaverProfile.errors;

    const loginParams: LoginParams = {
        providerId: profile.id,
        provider: AuthProvider.NAVER,
        name: profile.name,
        birthDate: (() => {
            const date = new Date(`${profile.birthyear}-${profile.birthday}`);
            return isNaN(date.getTime()) ? undefined : date.toISOString().split("T")[0]
        })()
    };

    return await login(loginParams);
}

async function login(params: LoginParams): Promise<LoginResponse> {
    const result: User | null = await repository.getUserByProvider(params.provider, params.providerId);
    const user: User = result ? result : await repository.createUser(params);

    const deviceId = ulid();
    const tokens = encodeJWT(user.id, deviceId);
    const hashedRefreshToken = createHash("sha256")
        .update(tokens.refreshToken)
        .digest("hex");

    await repository.createRefreshToken(user.id, hashedRefreshToken, deviceId);
    return tokens;
}

export const logout = async (user: User, params: {refreshToken: string}): Promise<void> => {
    const decoded = decodeJWT(params.refreshToken, false);
    if (!decoded?.deviceId) throw customError.UNAUTHORIZED("invalid refreshToken");
    if (user.id !== decoded.id) throw customError.UNAUTHORIZED("일치하지 않는 유저.");

    const hashedToken = createHash("sha256")
        .update(params.refreshToken)
        .digest('hex');

    await repository.logoutUser({userId: user.id, hashedToken, deviceId: decoded.deviceId});
}

export const refresh = async (params: {refreshToken: string}): Promise<LoginResponse> => {
    const decoded = decodeJWT(params.refreshToken, false);
    if (!decoded?.deviceId) throw customError.UNAUTHORIZED("invalid refreshToken");

    const user: User | null = await getUserById(decoded.id);
    if (!user) throw customError.UNAUTHORIZED("invalid user");

    const tokens = encodeJWT(user.id, decoded.deviceId);

    const hashedRefreshToken = createHash("sha256")
        .update(tokens.refreshToken)
        .digest("hex");
    await repository.createRefreshToken(user.id, hashedRefreshToken, decoded.deviceId);
    return tokens;
}

