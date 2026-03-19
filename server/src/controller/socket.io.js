const {
  checkSession
} = require('../controller/sessionController');
const {
  addSocket,
  deleteSocket,
  addPushMessage
} = require('./messagePush');
const {
  getRoomList
} = require('./room');
const {
  getLocalTime,
  timeToTimestamp
} = require("../utils/common");

const {
  getMyOnlieFriend,
  isMyFriend
} = require('./friend');
const {
  updateUserOnlieStatus
} = require('./account');

const logger = require('../lib/logger');
const SEND_TYPING_MAX_TIME = 30;
const CONSTANT = {
  TYPING: 'typing',
  ONLIE_STATUS: 'onlineStatus'
};

const onlineStatusPushMap = new Map(); // 上线推送

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time || 100);
  });
}

/**
 * @description 打字中
 */
async function handleTyping(data) {
  try {
    const {
      _uid,
      uid
    } = data;
    await sleep(500);
    const result = await isMyFriend(_uid, uid);
    if ((getLocalTime() - timeToTimestamp(result.lastSendTime)) > SEND_TYPING_MAX_TIME) {
      return;
    }
    addPushMessage(CONSTANT.TYPING, data.uid, {
      uid: _uid
    });
  } catch (error) {
  }
}

/**
 * 
 * @param {string} uid 
 * @param {number} status
 * @description 用户在线状态 
 */
async function handleOnlieStatus(uid, status) {
  try {
    const friends = await getMyOnlieFriend(uid);
    for (const { friendUid } of friends) {
      onlineStatusPushMap.set(friendUid, {
        friendUid,
        uid,
        status: status,
      }); // 设置推送
    }
    
    await sleep(1000); // await 1s
    onlineStatusPushMap.forEach((item) => {
      addPushMessage(CONSTANT.ONLIE_STATUS, item.friendUid, {
        uid: item.uid,
        status: item.status,
      });
      onlineStatusPushMap.delete(item.friendUid);
    });
  } catch (error) {
    logger(error);
  }
}

/**
 * 
 * @param {app} app 
 * @param {port} port 
 * @description 初始化socket
 */
function initSocket(app, port) {
  var server = require('http').createServer(app.callback());
  var io = require('socket.io')(server, {
    path: '/socket',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
  });

  // middleware
  io.use(async (socket, next) => {
    // console.log('socket.id',socket.id);
    const {
      token
    } = socket.handshake.query || {};
    try {
      const sessionData = await checkSession(token);
      socket._uid = sessionData._uid; // set _uid
      next();
    } catch (error) {
      // socket
      return next(new Error([401, "authentication error"]));
    }
  });

  io.on('connection', function (socket) {
    handleRoomPush(socket._uid, socket); // handle push service
    updateUserOnlieStatus(socket._uid, 1); // 更新用户在线状态
    handleOnlieStatus(socket._uid, 1); // 推送上线
    // 规定前端发送消息格式(type ,data|msg);
    socket.on('message', function (type, data) {
      // console.log('recive message is:', socket.id, data);
      // io.emit('message',{msg:'has receive '+ data});
      // io.emit(socket.id,{msg:'has receive '+ data}); //简单实现好友聊天（单-单聊天）
      // socket.broadcast.emit('broadcast');
      // socket.send({
      //   msg: 'has receive ' + data
      // }); //向soket发起者发送消息
      try {
        data._uid = socket._uid; // set _uid
        switch (type) {
          case CONSTANT.TYPING:
            handleTyping(data);
            break;
          default:
            break;
        }
      } catch (error) {
        console.log("message error", error);
      }
    });

    socket.on('error', function (err) {
      // console.log('socket err',err);
    });
    socket.on('disconnect', function (reason) {
      /**
       * 1.namespace disconnect （浏览器关闭）
       * 2.transport error (client主动发起disconnect和浏览器刷新)
       */
      // console.log('socket disconnect',reason);
      updateUserOnlieStatus(socket._uid, 0); // 更新在线状态为0（离线）
      deleteSocket(socket._uid); // 删除消息推送的socket
      handleOnlieStatus(socket._uid, 0); // 推送离线
    });
  });

  server.listen(port)
}

/**
 * 
 * @param {string} uid 
 * @param {string} socketId 
 */
async function handleRoomPush(uid, socket) {
  try {
    let roomList = await getRoomList(uid, 'id'); // 得到用户房间列表
    roomList = roomList.map(item => item.id); // 添加推送socket
    addSocket(roomList, socket, uid);
  } catch (error) {}
}



module.exports = (app, port) => {
  initSocket(app, port);
}