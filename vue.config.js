let publicPath = './';
module.exports = {
    publicPath: publicPath,
    devServer: {
        disableHostCheck: true,
        port: 1024, // 端口号
        host: "icenter.geovis.online",
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
        proxy: {
            "/cgi-bin": {
                target: "https://qyapi.weixin.qq.com",
                //ws: true,
                changeOrigin: true,
                secure: true,
                pathRewrite: {
                    '^/cgi-bin':'/cgi-bin'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
                }
            },
            "/connect": {
                target: "https://open.weixin.qq.com",
                //ws: true,
                changeOrigin: true,
                secure: true,
                pathRewrite: {
                    '^/connect':'/connect'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
                }
            },
            "/foo": {
                target: "<other_url>"
            },
            "/baseapi": {
                target: "https://licence.geovis.online",
                //ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/baseapi':'/'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
                }
            },
        } // 配置多个代理
    }
};
