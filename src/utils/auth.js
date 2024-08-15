import {getAgent} from "@/utils/client";
import qs from "qs";
import request from "@/utils/request";

const WX_AUTH_URL = "https://open.weixin.qq.com/connect/oauth2/authorize";
const ALIPAY_AUTH_URL = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm";

export const getToken = () => {
    return localStorage.getItem("token");
}
export const goAuthUrl = async (mc, beforePath, needInfo) => {
    const agent = getAgent();
    const base = `${window.location.protocol}//${location.host}`;
    const middlewarePath = needInfo ? 'register' : 'authing';
    let redirectUrl = `${base}/${middlewarePath}?before=${beforePath}`;
    if (mc) {
        redirectUrl += `&mc=${mc}`;
    }
    console.log("redirect:" + redirectUrl);
    const authParams = {
        redirect_uri: redirectUrl,
    };
    let authUrl;
    let appId = localStorage.getItem(agent + "_app_id");
    if (!appId) {
        const res = await request.get('/appId', {
            params: {
                mc
            }
        })
        appId = res.data
    }
    if (agent === "wx") {
        authUrl = WX_AUTH_URL;
        authParams.appid = appId;
        authParams.response_type = "code";
        authParams.scope = needInfo ? "snsapi_userinfo" : "snsapi_base";
    } else {
        authUrl = ALIPAY_AUTH_URL;
        authParams.app_id = appId;
        authParams.scope = needInfo ? "auth_user" : "auth_base";
    }
    console.log(appId)
    console.log(`${authUrl}?${qs.stringify(authParams)}`);
    window.location.replace(`${authUrl}?${qs.stringify(authParams)}`);
}