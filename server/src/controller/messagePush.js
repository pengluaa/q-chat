const roomSocketMap = new Map();
const userSocketMap = new Map();
const pushList = [];
let _lock = false;

/**
 * 
 * @param {socket} socket 
 * @description 消息推送服务
 */
function startPushService() {
    if (_lock) {
        return;
    }
    while (pushList.length) {
        try {
            _lock = true;
            const pushItem = pushList.splice(0, 1)[0];
            pushItem.socket.send(pushItem.type, pushItem.data);
        } catch (error) {
            _lock = false;
        }
    }
    _lock = false;
}

/**
 * 
 * @param {string} uid 
 * @param {data} data 
 * @param {string} type
 * @description 添加推送到推送列表 
 */
function addPushService(type, uid, data) {
    const socket = userSocketMap.get(uid);
    if (socket) {
        pushList.push({
            type: type || 'unknow',
            socket,
            data,
        });
    }
}


/**
 * 
 * @param {number} roomId 
 * @param {string} uid 
 * @description 增加群推送（加入群时、登录时）
 */
function addUserToRoom(roomId, uid) {
    if(!roomSocketMap.has(roomId)) {
        roomSocketMap.set(roomId, new Map());
    }
    roomSocketMap.get(roomId).set(uid,uid);
}

/**
 * 
 * @param {number} roomId 
 * @param {string} uid 
 * @description 删除群推送（退出群时）
 */
function removeUserFromRoom(roomId, uid) {
    roomSocketMap.get(roomId).delete(uid);
}

/**
 * 
 * @param {number} roomId 
 * @param {string} ownerUid -ownerUid
 * @param {object} data 
 */
function addPushRoomMessage(roomId, ownerUid, data) {
    try {
        const map = roomSocketMap.get(roomId);
        if (map && map.size) {
            map.forEach((_uid) => {
                if (ownerUid !== _uid) {
                    addPushService('room',_uid, data);
                }
            });
        }
        startPushService();
    } catch (error) {

    }
}

/**
 * 
 * @param {string} type 
 * @param {string} uid 
 * @param {data} data 
 * @description 添加消息推送服务（立即启动）
 */
function addPushMessage(type, uid, data) {
    addPushService(type, uid, data);
    startPushService();
}

/**
 * 
 * @param {Array<int>} roomIdList
 * @param {Socket Object} socket 
 * @param {string} uid 
 * @description 新增room socket
 */
function addSocket(roomIdList, socket, uid) {
    (roomIdList || []).map((roomId) => {
        if (!roomSocketMap.has(roomId)) {
            roomSocketMap.set(roomId, new Map());
        }
        roomSocketMap.get(roomId).set(uid, uid); //往群里添加需要推送的人
    });
    userSocketMap.set(uid, socket); // 保存socket
}

/**
 * 
 * @param {string} uid
 * @description 删除socket 
 */
function deleteSocket(uid) {
    userSocketMap.delete(uid); // 删除socket
    roomSocketMap.forEach((map) => {
        if (map.has(uid)) {
            map.delete(uid);
        }
    }); // delete group
}

module.exports = {
    addSocket,
    deleteSocket,
    addPushMessage,
    addPushRoomMessage,
    addUserToRoom,
    removeUserFromRoom,
}