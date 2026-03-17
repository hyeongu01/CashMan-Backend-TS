import {describe, expect, test, vi, beforeEach} from "vitest";
import {createHash} from "crypto";
import {encodeJWT, decodeJWT} from "@common/auth/jwt";
import {validateNaverLoginParams, validateNaverProfile} from "./auth.dto";

// ──DTO 검증 테스트 ──

describe("auth dto", () => {
    test("[dto] validateNaverLoginParams - 유효한 파라미터", () => {
        const valid = validateNaverLoginParams({code: "abc123", state: "xyz456"});
        expect(valid).toBe(true);
    });

    test("[dto] validateNaverLoginParams - code 누락", () => {
        const valid = validateNaverLoginParams({state: "xyz456"});
        expect(valid).toBe(false);
    });

    test("[dto] validateNaverLoginParams - state 누락", () => {
        const valid = validateNaverLoginParams({code: "abc123"});
        expect(valid).toBe(false);
    });

    test("[dto] validateNaverLoginParams - 빈 객체", () => {
        const valid = validateNaverLoginParams({});
        expect(valid).toBe(false);
    });

    test("[dto] validateNaverLoginParams - 추가 필드 거부", () => {
        const valid = validateNaverLoginParams({code: "abc", state: "xyz", extra: "no"});
        expect(valid).toBe(false);
    });

    test("[dto] validateNaverProfile - 유효한 프로필", () => {
        const valid = validateNaverProfile({
            id: "12345",
            name: "홍길동",
            birthday: "01-01",
            birthyear: "1990",
        });
        expect(valid).toBe(true);
    });

    test("[dto] validateNaverProfile - 필수 필드 누락", () => {
        const valid = validateNaverProfile({id: "12345", name: "홍길동"});
        expect(valid).toBe(false);
    });
});

// ── JWT 유틸 테스트 ──

describe("auth jwt", () => {
    const userId = "test-user-id";
    const deviceId = "test-device-id";

    test("[jwt] encodeJWT - accessToken, refreshToken 반환", () => {
        const tokens = encodeJWT(userId, deviceId);
        expect(tokens).toHaveProperty("accessToken");
        expect(tokens).toHaveProperty("refreshToken");
        expect(typeof tokens.accessToken).toBe("string");
        expect(typeof tokens.refreshToken).toBe("string");
    });

    test("[jwt] decodeJWT - accessToken 디코딩", () => {
        const tokens = encodeJWT(userId, deviceId);
        const decoded = decodeJWT(tokens.accessToken, true);
        expect(decoded).not.toBeNull();
        expect(decoded!.id).toBe(userId);
    });

    test("[jwt] decodeJWT - refreshToken 디코딩 (deviceId 포함)", () => {
        const tokens = encodeJWT(userId, deviceId);
        const decoded = decodeJWT(tokens.refreshToken, false);
        expect(decoded).not.toBeNull();
        expect(decoded!.id).toBe(userId);
        expect(decoded!.deviceId).toBe(deviceId);
    });

    test("[jwt] decodeJWT - 잘못된 토큰은 null 반환", () => {
        const decoded = decodeJWT("invalid.token.value", true);
        expect(decoded).toBeNull();
    });

    test("[jwt] decodeJWT - accessToken을 refreshSecret으로 디코딩 시 null", () => {
        const tokens = encodeJWT(userId, deviceId);
        const decoded = decodeJWT(tokens.accessToken, false);
        expect(decoded).toBeNull();
    });

    test("[jwt] decodeJWT - refreshToken을 accessSecret으로 디코딩 시 null", () => {
        const tokens = encodeJWT(userId, deviceId);
        const decoded = decodeJWT(tokens.refreshToken, true);
        expect(decoded).toBeNull();
    });
});

// ── Service 테스트 (mock) ──

vi.mock("./auth.repository", () => ({
    getUserByProvider: vi.fn(),
    createUser: vi.fn(),
    createRefreshToken: vi.fn(),
    logoutUser: vi.fn(),
}));

vi.mock("@features/users/users.repository", () => ({
    getUserById: vi.fn(),
}));

vi.mock("@libs/redis", () => ({
    default: {del: vi.fn()},
}));

import * as service from "./auth.service";
import * as repository from "./auth.repository";
import {getUserById} from "@features/users/users.repository";
import type {User} from "@features/users/users.dto";

const mockUser: User = {
    id: "user-123",
    name: "테스트유저",
    timezone: "Asia/Seoul",
    currency: "KRW",
    birthDate: null,
    createdAt: new Date(),
    deletedAt: null,
};

describe("auth service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ── logout ──

    test("[service] logout - 정상 로그아웃", async () => {
        const tokens = encodeJWT(mockUser.id, "device-1");
        const hashedToken = createHash("sha256").update(tokens.refreshToken).digest("hex");

        await service.logout(mockUser, {refreshToken: tokens.refreshToken});

        expect(repository.logoutUser).toHaveBeenCalledWith({
            userId: mockUser.id,
            hashedToken,
            deviceId: "device-1",
        });
    });

    test("[service] logout - 잘못된 refreshToken이면 에러", async () => {
        await expect(
            service.logout(mockUser, {refreshToken: "invalid-token"})
        ).rejects.toMatchObject({statusCode: 401});
    });

    test("[service] logout - 유저 id 불일치 시 에러", async () => {
        const otherUser: User = {...mockUser, id: "other-user"};
        const tokens = encodeJWT(mockUser.id, "device-1");

        await expect(
            service.logout(otherUser, {refreshToken: tokens.refreshToken})
        ).rejects.toMatchObject({statusCode: 401});
    });

    // ── refresh ──

    test("[service] refresh - 정상 토큰 갱신", async () => {
        const tokens = encodeJWT(mockUser.id, "device-1");
        vi.mocked(getUserById).mockResolvedValue(mockUser);
        vi.mocked(repository.createRefreshToken).mockResolvedValue(undefined);

        const result = await service.refresh({refreshToken: tokens.refreshToken});

        expect(result).toHaveProperty("accessToken");
        expect(result).toHaveProperty("refreshToken");
        expect(getUserById).toHaveBeenCalledWith(mockUser.id);
        expect(repository.createRefreshToken).toHaveBeenCalled();
    });

    test("[service] refresh - 잘못된 refreshToken이면 에러", async () => {
        await expect(
            service.refresh({refreshToken: "invalid-token"})
        ).rejects.toMatchObject({statusCode: 401});
    });

    test("[service] refresh - 존재하지 않는 유저면 에러", async () => {
        const tokens = encodeJWT(mockUser.id, "device-1");
        vi.mocked(getUserById).mockResolvedValue(null);

        await expect(
            service.refresh({refreshToken: tokens.refreshToken})
        ).rejects.toMatchObject({statusCode: 401});
    });
});
