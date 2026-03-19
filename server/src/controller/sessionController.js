const {
    find,
    add,
    update
} = require('../utils/mysql');
const {
    generateToken,
    getLocalTime,
    timestampToTime
} = require('../utils/common');
const EXPIRED_TIME = 60 * 60; // 60s = 1min
/**
 * 
 * @param {string} uid 
 * @description 登陆获取session || 刷新session
 */
async function getSession(uid) {
    try {
        const accessToken = generateToken(16);
        const expireTime = timestampToTime((getLocalTime() + EXPIRED_TIME) * 1000);
        await update('session', {
            accessToken,
            expireTime,
            status: 1
        }, `uid='${uid}'`);
        return {
            accessToken,
            expireTime,
        }
    } catch (error) {
        throw new Error("get session error");
    }
}

/**
 * 
 * @param {string} session 
 * @description 检查session
 */
async function checkSession(session) {
    const [sessionData] = await find('session', `accessToken='${session}' ORDER BY expireTime`, '', '', 1);
    if (!sessionData) {
        throw new Error("session error");
    }
    if (getLocalTime() > sessionData.expireTime) {
        //session 已过期||无效
        update('session', {
            status: 0
        }, `id=${sessionData.id}`)
        throw new Error("session is expired");
    }

    return {
        _uid: sessionData.uid
    }
}

module.exports = {
    checkSession,
    getSession
}