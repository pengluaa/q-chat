const {
    find,
    add,
    update,
    sql
} = require('../utils/mysql');
const {
    getLocalTime,
    getPasswordSha1,
    generateToken
} = require('../utils/common');
const {
    getSession
} = require('../controller/sessionController');


const userInfoCache = new Map(); // userinfo cache

/**
 * 
 * @param {string} password 
 */
function getPassword(password) {
    return getPasswordSha1(password);
}

/**
 * 
 * @param {string} uid 
 * @param {number} status 
 * @description 更新用户在线状态
 */
exports.updateUserOnlieStatus = function (uid, status) {
    return update('user', {
        onlineStatus: `${status}`
    }, `uid='${uid}'`);
}

/**     
 * @param {object} userData
 * @description 更新用户接口使用
 */
exports.updateUser = function (uid, userData) {

    if (!userData.nickName) {
        throw new Error("nickName not null");
    }
    const updateData = {
        nickName: userData.nickName,
        signature: userData.signature || ''
    };
    if (userData.avatar) {
        updateData.avatar = userData.avatar;
    }
    if (userData.password && userData.password.length > 5) {
        updateData.password = getPassword(userData.password);
    }
    userInfoCache.delete(uid); // 删除缓存
    return update('user', updateData, `uid='${uid}'`);
}

exports.login = async function (account, password) {
    const [user] = await sql(`SELECT u.uid,u.nickName,u.sex, u.signature,u.avatar,u.registerTime from user as u WHERE account='${account}' AND password='${getPassword(password)}'`);
    if (!user) {
        throw new Error("login fail");
    }
    const sessionResult = await getSession(user.uid);
    user.sessionKey = sessionResult.accessToken;
    user.expireTime = sessionResult.expireTime;
    userInfoCache.delete(user.uid); // 删除缓存
    return user;
}

exports.register = async function (userData) {
    try {
        userData.uid = generateToken(16);
        await add('user', {
            uid: userData.uid,
            password: getPassword(userData.password),
            account: userData.account,
            nickName: userData.nickName,
            phoneNumber: userData.phoneNumber || '',
            email: userData.email || '',
            loginIp: userData.ip || '',
        });
        return userData;
    } catch (error) {
        if (error.errno === 1062) {
            throw new Error(["Error", 1062, 'this already register', '这个账号已经被注册了']);
        }
        throw new Error("register fail");
    }
}

/**
 * 
 * @param {string} uid 
 */
exports.getUserInfoById = async function (uid) {
    if (userInfoCache.has(uid)) {
        return userInfoCache.get(uid);
    }
    const [userInfo] = await find('user', `uid='${uid}'`, 'uid,nickName,sex,avatar,signature,birthday,registerTime,onlineStatus,status', '', 1);
    if (userInfo) {
        delete userInfo.id; // delete id
        delete userInfo.password; // delete pwd
        userInfo.surname = userInfo.nickName[0];
        userInfoCache.set(uid, userInfo);
        return userInfo;
    }
    throw new Error("not find user info");
}