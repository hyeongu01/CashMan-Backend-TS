import config from "@config/config";
import {customError} from "@common/CustomResponse";
import redis from "@libs/redis";
import {randomBytes} from "crypto";


export const generateNaverLoginURL = async (): Promise<string> => {
    const clientId: string | undefined = config.naver?.clientId;
    const redirectURI: string | undefined = config.naver?.redirectUri;
    if (!clientId || !redirectURI) throw customError.SERVER_ERROR();

    const state: string = randomBytes(32).toString('hex');
    await redis.set(`naverLoginState:${state}`, 1, {EX: 300, NX: true});

    return 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + clientId + '&redirect_uri=' + redirectURI + '&state=' + state;
}
