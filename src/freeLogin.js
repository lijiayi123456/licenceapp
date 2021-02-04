import {getAcessToken,getUserId,getUserInfo,getCorpId} from './api/thirdApi';
import store from './store';
import {setToken,getToken} from './utils/cookie';
import {searchUser} from './api/userApi';

// 1）若地址栏中无code，判断是否存在token,
const currentUrl = window.location.href;
let userId = '';
let currentAccessToken = '';

// 获取token
export async function storeAccessToken() {
    await getAcessToken().then((res)=>{ 
      store.commit('setUserAccessToken',res.access_token); // 把token存储到vuex
      setToken(res.access_token)  // 把token存储到cookie中
      
      //console.log(newUrl)
      //window.location.href = newUrl;
      //openRedirectUrl();
      redirectNewUrl()
    })
}
function redirectNewUrl() {
  const domainUrl = "https://open.weixin.qq.com/connect/oauth2/authorize";
  //const CORID = 'ww819cb229594cb6b9';
  const CORID = await getCorpId();   // 从后端获取得到
  const redirectUrl = encodeURIComponent(window.location.href);
  // 该url用于获取code，同时对浏览器进行重定向
  const newUrl = `${domainUrl}?appid=${CORID}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
  window.location.href = newUrl;
}

// 若地址栏中无code,首次进入该页面
if(currentUrl.indexOf('code=') === -1) {
  //console.log(getToken())
  //if(!getToken()) {
  // 获取token,存储token,调用回调地址
  storeAccessToken();
  //redirectNewUrl();
} 
// 首先判断地址栏中是否有code
if(currentUrl.indexOf('code=') !== -1) {
  const code = currentUrl.split('code=')[1].split('&')[0];
  currentAccessToken = getToken();
  // 通过code获得用户userId
  getUserId(currentAccessToken,code).then((res)=>{
    userId = res.UserId;
    // 获取用户的详细信息
    getUserInfo(currentAccessToken,userId).then((res)=>{
      let userParam = {
        "department": res.department.join(','),
        "other": res.alias,
        "userIdentify": res.userid,
        "userName": res.name
      }
      // let userParam = {
      //   "department": '数字地球研发部',
      //   "other": '用于企稳小程序开发',
      //   "userIdentify": 'lijy12345678',
      //   "userName": '李佳'
      // }
      searchUser(userParam).then(async (res)=>{
        await store.commit('setUserInfo',res);
      })
    })
  })
} 







