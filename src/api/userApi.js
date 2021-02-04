import packageAxios from '../utils/packageAxios';
import url from '../../public/urls';

const BASE_URL = url.systemUrl;
// const BASE_URL = '/baseapi'

/**
 * 校验用户
 * @param  department 部门
 * @param  other  其他信息
 * @param  userIdentify 用户标识
 * @param  userName  用户姓名
 */
export function searchUser(params) {
    let url = `${BASE_URL}/api/v1/searchUser`
    return packageAxios.post(url,params)
}