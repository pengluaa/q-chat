/**
 * body parser (基础版，只针对json)
 */

const logger = require('../lib/logger');
const { checkSession } = require('../controller/sessionController');

function isCheckAuth(api) {
    if (!api) return false;
    const index = api.indexOf('?');
    api = index > 0 ? api.substr(0, index) : api;
    const allowList = [
        '',
        '/book/getConfig',
        '/account/wxLogin',
        '/account/login',
        '/account/register'
    ];
    return allowList.indexOf(api) >= 0 ? false : true;
}

module.exports = async function (ctx, next) {
    const parseSession = () => {
        return new Promise((resolve, reject) => {
            const authorization = ctx.request.header['authorization'],
                session = authorization ? authorization.split(' ')[1] : '',
                method = (ctx.request.method || '').toUpperCase();
            
            if (method === 'OPTIONS') {
                return resolve();
            }
            if (!isCheckAuth(ctx.request.url ||'')) {
                return resolve();
            }

            checkSession(session)
                .then(sessionData => {
                    if (!ctx.request.body) ctx.request.body = {};
                    ctx.request.body = Object.assign(ctx.request.body, sessionData);
                    resolve();
                }, err => {
                    ctx.status = 401;
                    ctx.body = err.msg || 'Unauthorized';
                    reject(ctx.body);
                })
        })
    }

    await parseSession();
    await next();
}
