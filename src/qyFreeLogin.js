import {getAcessToken,getUserId,getUserInfo} from './api/thirdApi';
import store from './store';
import {setToken,getToken} from './utils/cookie';
import {searchUser} from './api/userApi';

/** 企微免登录流程
 * 1. 根据corip,sercet来获取应用的AccessToken
 * 2. 根据CORID,redirect_uri重定向到地址，同时获取用户code，在地址栏中获得
 * 3. 根据AccessToken和code获取用户UserId
 * 4. 根据UserId和Token获取用户的详细信息  （为最终目的）
 */

/**  用户的具体信息存储，使用locationStorage来存储，使用qyUserInfo来存储，用户的信息基本不会发生改变
 *   1. 首先判断qyUserInfo中是否存储数据
 *   2. 若qyUserInfo中存在数据，调用  searchUser接口，进入许可申请系统
 *   3. 若用户初次进入系统，qyUserInfo中不存在数据，则需要调用企业微信免登录流程，获取用户信息，并存储用户信息，然后进入许可申请系统
 */


export async function qyFreeLogin() {
    await getAcessToken().then(async(res)=>{ 
        await store.commit('setUserAccessToken',res.access_token); // 把token存储到vuex
        await setToken(res.access_token)  // 把token存储到cookie
        await redirectNewUrl(); // 重定向，获取code
        //let currentUrl = window.location.href;  // 当前地址
        //await storeUserInfo(currentUrl);
    })
}
export async function redirectNewUrl() {
    const domainUrl = "https://open.weixin.qq.com/connect/oauth2/authorize";
    //const CORID = 'ww819cb229594cb6b9';
    const CORID = await getCorpId();   // 从后端获取得到
    const redirectUrl = encodeURIComponent(window.location.href);
    const newUrl = `${domainUrl}?appid=${CORID}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
    window.location.href = newUrl;
}

//localStorage.setItem('qyUserInfo',null)

// 若locationStorage不存在qyUserInfo且地址栏中有code，则需要重新获取用户信息

let currentUrl = window.location.href;
//let qyUserInfo = JSON.parse(localStorage.getItem('qyUserInfo'));
//if(currentUrl.indexOf('code=') !== -1 && localStorage.getItem('qyUserInfo')===null) {
if(currentUrl.indexOf('code=') !== -1 && (localStorage.getItem('qyUserInfo')===null )) {
    const code = currentUrl.split('code=')[1].split('&')[0];
    let currentAccessToken = getToken();
    // 通过code获得用户userId
    getUserId(currentAccessToken,code).then((res)=>{
      let userId = res.UserId;
      // 获取用户的详细信息
      getUserInfo(currentAccessToken,userId).then((res)=>{
        let userParam = {
          "department": res.department.join(','),
          "other": res.alias,
          "userIdentify": res.userid,
          "userName": res.name
        }
        // 把获取的信息存储于本地
        localStorage.setItem('qyUserInfo',JSON.stringify(userParam));
        // 用户进入许可申请系统
        searchUser(userParam).then(async (res)=>{
          await store.commit('setUserInfo',res);
        })
      })
    })
} else if(localStorage.getItem('qyUserInfo') === null ) {
    qyFreeLogin();
} else {
    let qyUserInfo = JSON.parse(localStorage.getItem('qyUserInfo'))
    searchUser(qyUserInfo).then(async (res)=>{
        await store.commit('setUserInfo',res);
    })
}
