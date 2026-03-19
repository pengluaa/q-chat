const { find, add, update, sql: Sql } = require('../utils/mysql')

const { getRoomLastMessage } = require('./message')

const { addUserToRoom } = require('./messagePush')

/**
 *
 * @param {string} uid
 * @param {number} roomId
 * @description 添加成员
 */
async function addMember(uid, roomId) {
	const [room] = await find('room', `id='${roomId}'`, '', '', 1)
	if (!room) {
		throw new Error('room not found')
	}
	try {
		await add('`member`', {
			roomId,
			uid
		})
		addUserToRoom(roomId, uid)
		return true
	} catch (error) {
		if (error.errno === 1062) {
			throw new Error([
				'Error',
				1062,
				'Add Room Duplicate',
				'你已经加入过此房间'
			])
		}
		throw new Error('Add Room Error')
	}
}

/**
 *
 * @param {string} keyword
 * @description 搜索房间
 */
function searchRoom(keyword = '', ownerUid) {
	keyword = keyword.trim()
	return find(
		'room',
		`ownerUid <> '${ownerUid}' and (name like '%${keyword}%' or roomNo like '%${keyword}%')`
	)
}

/**
 * @param {string} uid
 * @param {string} fields
 * @description 获取用户所在房间
 */
async function getRoomList(uid, fields) {
	return await find(
		'room',
		`id IN (SELECT roomId FROM \`member\` WHERE uid='${uid}')`,
		fields || ''
	)
}

/**
 *
 * @param {string} uid
 * @description 获取用户加入的room
 */
async function getOwnerRoom(uid) {
	const list = await Sql(`SELECT r.id,r.ownerUid,r.roomNo,r.name,r.createTime,r.logo,r.total,r.memberCount,r.postscript,m.notReadCount
    FROM room as r INNER JOIN \`member\` as m ON r.id=m.roomId WHERE uid='${uid}'`)

	for (const item of list) {
		item.last = await getRoomLastMessage(item.id)
	}
	return list
}
/**
 * @param {string} _uid
 * @param {string} name
 * @param {string} postscript
 * @param {string} logo
 */
async function createRoom(_uid, name, roomNo, postscript = '', logo = '') {
	let res
	try {
		res = await add('room', {
			ownerUid: _uid,
			roomNo,
			name,
			postscript,
			logo: logo
		})
	} catch (error) {
		if (error.errno === 1062) {
			throw new Error([
				'Error',
				1062,
				'Crate Room Duplicate',
				'此房间号已被创建'
			])
		}
		throw new Error('Add Room Error')
	}
	await addMember(_uid, res.insertId);
	return
}

/**
 * @description 编辑房间
 */
async function updateRoom(roomId, uid, name, postscript = '', logo = '') {
	await isMyRoom(uid, roomId)
	const res = await update(
		'room',
		{
			name,
			postscript,
			logo
		},
		`id='${roomId}' and ownerUid='${uid}'`
	)
	return
}

/**
 *
 * @param {string} uid
 * @param {number} roomId
 * @description 判断是否是我创建的房间
 */
async function isMyRoom(uid, roomId) {
	const [data] = await find(
		'room',
		`ownerUid='${uid}' and id='${roomId}'`,
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
	createRoom,
	getRoomList,
	getOwnerRoom,
	searchRoom,
	addMember,
	updateRoom
}
