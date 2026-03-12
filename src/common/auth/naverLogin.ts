import config from "@config/config";


/**
const clientId: string | undefined = config.naver?.clientId;
const redirectURI: string | undefined = config.naver?.redirectUri;
if (!clientId || !redirectURI) throw CustomError.SERVER_ERROR("naver clientId or redirectURI is missing");

const state: string = "RANDOM_STATE";
// state 랜덤 생성해서 redis 에 저장하는 코드 추가

const api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + clientId + '&redirect_uri=' + redirectURI + '&state=' + state;
return res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
 */
export const generateNaverLoginURL = (): string | null => {
    const clientId: string | undefined = config.naver?.clientId;
    const redirectURI: string | undefined = config.naver?.redirectUri;
    if (!clientId || !redirectURI) return null;

    const state: string = "RANDOM_STATE";
    // state 랜덤 생성해서 redis 에 저장하는 코드 추가

    return 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + clientId + '&redirect_uri=' + redirectURI + '&state=' + state;
}
