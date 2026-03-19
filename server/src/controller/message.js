const { find, add, update } = require('../utils/mysql')
const { getLocalTime } = require('../utils/common')

const { getUserInfoById } = require('./account')

const { addPushMessage, addPushRoomMessage } = require('./messagePush')
const { isMyFriend } = require('./friend')
const { request } = require('../utils/request')
const { chatAi: chatAiConfig } = require('../config/index.config')

/**
 *
 * @param {string} ownerUid
 * @param {string} friendUid
 * @description Ai自动发消息
 */
function handleAiChat(aiUid, friendUid, content) {
	try {
		request(
			{
				hostname: chatAiConfig.hostname,
				url: '/chatAi',
				method: 'post',
				port: chatAiConfig.port,
				data: {
					content: decodeURIComponent(content)
				}
			},
			false
		).then(res => {
			if (res.ret === 0) {
				//收到消息
				sendMessage(friendUid, aiUid, res.data.answer)
			}
		})
	} catch (error) {
		console.log('err', error)
	}
}

/**
 *
 * @param { string } uid -friend uid
 * @param { string } ownerUid
 * @param { string } content
 */
async function sendMessage(friendUid, ownerUid, content) {
	const time = getLocalTime(false)
	const datas = {
		sendUid: ownerUid,
		reciveUid: friendUid,
		content,
		time
	}

	await isMyFriend(ownerUid, friendUid) // 判断是不是好友
	const sqlData = await add('history', datas)

	datas.id = sqlData.insertId
	datas.isSender = false

	// 如果是机器人
	if (friendUid === chatAiConfig.uid) {
		handleAiChat(friendUid, ownerUid, content)
	} else {
		// 如果是机器人笨笨
		if (ownerUid === chatAiConfig.uid) {
			datas.isAiBenBen = true
		}
		addPushMessage('single', friendUid, datas) // push service
	}

	// response
	datas.isSender = true
	return datas
}

/**
 *
 * @param {string} _uid
 * @param {number} roomId
 * @param {string} content
 * @description 发送聊天室消息
 */
async function sendRoomMessage(ownerUid, roomId, content) {
	// 判断是否在房间里
	await isInRoom(ownerUid, roomId)
	const sqlData = await add('room_history', {
		sendUid: ownerUid,
		content,
		roomId
	})

	const data = {
		id: sqlData.insertId,
		isSender: false,
		content,
		sendUid: ownerUid,
		userInfo: await getUserInfoById(ownerUid),
		roomId,
		time: getLocalTime(false)
	}

	addPushRoomMessage(roomId, ownerUid, data)
	data.isSender = true
	return data
}

/**
 * @function getChatHistory
 * @param {string} sendUid
 * @param {string} reciveUid,
 * @param {string} orderBy,
 * @param {number} limit
 */
async function getChatHistory({
	sendUid,
	reciveUid,
	orderBy,
	updateRead,
	limit
}) {
	const result = await find(
		'history',
		`sendUid='${reciveUid}' AND reciveUid='${sendUid}' OR sendUid='${sendUid}' AND reciveUid='${reciveUid}'`,
		'',
		`time ${orderBy || 'ASC'}`,
		limit || ''
	)
	if (updateRead !== false) {
		update(
			'friend',
			{
				notReadCount: 0
			},
			`ownerUid='${sendUid}' AND friendUid='${reciveUid}'`
		)
	}
	return result
}
/**
 *
 * @param {number} roomId
 * @param {string} _uid
 * @description 获取多人聊天消息
 */
async function getRoomChatHistory(roomId, _uid) {
	const chatList = await find('room_history', `roomId=${roomId}`, '*', 'time')
	for (let i = 0; i < chatList.length; i++) {
		const sendUid = chatList[i].sendUid
		if (sendUid === _uid) {
			chatList[i].userInfo = null
		} else {
			chatList[i].userInfo = await getUserInfoById(sendUid)
		}
	}
	update(
		'`member`',
		{
			notReadCount: 0
		},
		`roomId='${roomId}' AND uid='${_uid}'`
	)
	return chatList
}

/**
 *
 * @param {string} sendUid
 * @param {string} reciveUid
 * @description 获取最新聊天消息
 */
async function getLastMessage(sendUid, reciveUid) {
	const [last] = await getChatHistory({
		sendUid,
		reciveUid,
		updateRead: false,
		orderBy: 'DESC',
		limit: 1
	})
	return last || {}
}

/**
 *
 * @param {number} roomId
 * @description 获取多人聊天最新消息
 */
async function getRoomLastMessage(roomId) {
	const [last] = await find(
		'room_history',
		`roomId=${roomId}`,
		'*',
		'time DESC',
		1
	)
	return last || {}
}

/**
 *
 * @param {string} uid
 * @description 获取未读消息情况（单个多少未读和多人聊天未读数量）
 */
async function getMessageNotRead(uid) {
	const sqlQue = [
		find('friend', `ownerUid='${uid}'`, 'SUM(notReadCount) as count'),
		find('`member`', `uid='${uid}'`, 'SUM(notReadCount) as count')
	]
	const [single, room] = await Promise.all(sqlQue)
	return {
		single: single[0].count,
		room: room[0].count
	}
}

/**
 *
 * @param {string} uid
 * @param {number} roomId
 * @description 判断是否在房间里
 */
async function isInRoom(uid, roomId) {
	const [data] = await find(
		'`member`',
		`uid='${uid}' and roomId='${roomId}'`,
		'*',
		'',
		1
	)
	if (data.id) {
		return data
	}
	throw new Error('not in room')
}

module.exports = {
	sendMessage,
	getChatHistory,
	getRoomChatHistory,
	sendRoomMessage,
	getLastMessage,
	getRoomLastMessage,
	getMessageNotRead,
	isInRoom
}
