import packageAxios from '../utils/packageAxios';
import url from '../../public/urls';

const BASE_URL = url.systemUrl;


//=============================许可申请====================================
/** 获取用户的表单
 * @param {*} userIdentify  用户标识
 * @param {*} approvalStatus 审批状态  0返回待审批，1返回已审批
 * @author lijy
 * @date 2021-01-26
 */
export function getOrderList(userIdentify,approvalStatus) {
    let url = `${BASE_URL}/api/v1/getOrder?userIdentify=${userIdentify}&approvalStatus=${approvalStatus}`
    return packageAxios.get(url)
}

/** 提交许可申请表单
 * @params licenceParams 表单内容
 * @author lijy
 * @date 2021-01-26
 */
export function submitLicenceForm(licenceParams) {
    let url = `${BASE_URL}/api/v1/createOrder`;
    return packageAxios.post(url,licenceParams)
}

/** 管理员审批订单
 * @param orderIdentify  表单号
 * @param approvalStatus 审批状态
 * @param rejectedDescription 拒绝理由
 * @author lijy
 * @date 2021-01-26
 */
export function approvalOrder(orderIdentify,approvalStatus,rejectedDescription) {
    let url = `${BASE_URL}/api/v1/approvalOrder?orderIdentify=${orderIdentify}&approvalStatus=${approvalStatus}&rejectedDescription=${rejectedDescription}`;
    return packageAxios.get(url,)
}

//==========================================许可模块=========================================
/** 获取许可模块
 *  @author lijy
 *  @date 2021-01-26
 */
export function getLicenceModulesList() {
    let url = `${BASE_URL}/api/v1/getModulesList`;
    return packageAxios.get(url);
}

//========================================下载许可码========================================
/**  下载许可码
 * @params orderIdentify
 * @author lijy
 * @date 2021-01-28
 */
export function downloadLicenceCode(orderIdentify) {
    let url = `${BASE_URL}/api/v1/downloadLicenceCode?orderIdentify=${orderIdentify}`
    return packageAxios.get(url);
}
