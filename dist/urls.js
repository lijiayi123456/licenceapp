export default {
    //systemUrl: 'http://192.168.71.86:7650',
    //systemUrl: 'http://licence.geovis.online',
    openapiUrl: '/connect',  
    //==========================================================

    // 开发IP
    // systemUrl: '/baseapi', // 为了跨域使用
    // qyapiUrl:  'https://qyapi.weixin.qq.com/cgi-bin',

    //==========================================================
    // 部署IP
    systemUrl: `${window.location.protocol}//${window.location.host}`,
    qyapiUrl:  'https://qyapi.weixin.qq.com/cgi-bin'
}