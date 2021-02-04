import packageAxios from '../utils/packageAxios';
import url from '../../public/urls';

const BASE_URL = url.systemUrl;
const openAPI_URL = url.openapiUrl;
const QYAPI_URL = url.qyapiUrl;
/** 获取用户的accessToken
 * @author lijy
 * @date 2021-01-22
 */
export function getAcessToken() {
    // const CORPID = 'ww819cb229594cb6b9';
    // const CORPSECRET = 'TtyLjxhMIe6Krj-szTatnqSlyRZ-BJnXGdP7mbjFLT8'
    // const qyUrl = encodeURIComponent(`${QYAPI_URL}/gettoken?corpid=${CORPID}&corpsecret=${CORPSECRET}`);
    // const url = `${BASE_URL}/api/v1/url?url=${qyUrl}`
    
    const url = `${BASE_URL}/api/v1/getToken`  // corpid和corpsecret从后端获取
    
    return packageAxios.get(url);
}

/**
 * 获取用户Id
 * @param {*} accessAtoken 
 * @param {*} userId 
 */
export function getUserId(accessAtoken,code) {
    let qyUrl = encodeURIComponent(`${QYAPI_URL}/user/getuserinfo?access_token=${accessAtoken}&code=${code}`)
    const url = `${BASE_URL}/api/v1/url?url=${qyUrl}`;
    return packageAxios.get(url);
}

/** 获取用户的具体信息
 * @params accessAtoken 
 * @params userId
 * @author lijy
 * @date 2021-01-22
 */
export function getUserInfo(accessAtoken,userId) {
    let qyUrl = encodeURIComponent(`${QYAPI_URL}/user/get?access_token=${accessAtoken}&userid=${userId}`);
    const url = `${BASE_URL}/api/v1/url?url=${qyUrl}`;
    //return jsonp(url)
    return packageAxios.get(url);
}

/**  获取应用所在公司的CORPID
 *  @author lijy
 *  @date 2021-02-03
 */
export function getCorpId() {
    let url = `${BASE_URL}/api/v1/getCorpId`;
    return packageAxios.get(url);
}

/**
 * 打开定向url
 */
export function openRedirectUrl() {
    const CORID = 'ww819cb229594cb6b9';
    const redirectUrl = encodeURIComponent("http://licence.geovis.online:1024");
    const url = `${openAPI_URL}/oauth2/authorize?appid=${CORID}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
    //return jsonp(url)
    return packageAxios.get(url);
}

