const allowCrossList = [
    'chat.bubaocloud.xin',
];
const {
    isProd
} = require("../config/index.config");
/**
 * @description 获取是否跨域
 * @return {Boolean} 
 */
function checkCrosStatus(url) {
    if (!isProd) { return true };

    try {
        const { host } = new URL(url || '');
        for (const item of allowCrossList) {
            if (item === host) {
                return true;
            }
        }
        throw new Error();
    } catch (error) {
        throw new Error("orgin not permission");
    }
}
/**
 * 跨域处理模块
 */
module.exports = async function (ctx, next) {
    try {
        // 调用下一个 middleware
        await next();
        const origin = ctx.header.origin;
        checkCrosStatus(origin);
        // ctx.set('Access-Control-Allow-Origin', origin);
        // ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS');
        // ctx.set('Access-Control-Allow-Headers', "*");

        ctx.set({
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Methods": '*',
            "Access-Control-Allow-Headers": "*, Authorization, Content-Type"
        });
    } catch (e) {
        // 输出详细的错误信息
        e = e || '';
        ctx.status = 403;
        ctx.body = {
            code: -1,
            error: e && e.message ? e.message : e.toString()
        }
    }
}