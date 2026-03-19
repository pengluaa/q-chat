const { find, add, addRow, update, sql: Sql } = require('../utils/mysql')

/**
 *
 * @param {string} ownerUid
 * @param {string} friendUid
 * @description 是否是朋友关系
 */
async function isMyFriend(ownerUid, friendUid) {
	const [data] = await find(
		'friend',
		`ownerUid='${ownerUid}' and friendUid='${friendUid}'`,
		'*',
		'',
		1
	)
	if (data.id) {
		return data
	}

	throw new Error('not friends')
}

/**
 *
 * @param {string} keyword keyword
 */
async function searchAccount(keyword = '', ownerUid) {
	try {
		keyword = keyword.trim()
		const result = await find(
			`user`,
			`nickName like '%${keyword}%' and uid <> '${ownerUid}'`,
			[
				'id',
				'uid',
				'nickName',
				'sex',
				'avatar',
				'signature',
				'birthday',
				'status'
			],
			'',
			30
		)
		return Promise.resolve(result)
	} catch (error) {
		return Promise.reject(error)
	}
}

/**
 *
 * @param {string} _uid owner uid
 * @param {string} uid add uid
 * @param {string} remark add remarks 备注
 */
async function addFriend(ownerUid, friendUid, remark = '') {
	try {
		await addRow(
			'friend',
			['ownerUid', 'friendUid'],
			[
				[ownerUid, friendUid],
				[friendUid, ownerUid]
			]
		)
		return
	} catch (error) {
		if (error.errno === 1062) {
			throw new Error([
				'Error',
				'1062',
				'you already add this friend',
				'你已经添加过此好友'
			])
		}
		throw new Error('add friend error')
	}
}

/**
 *
 * @param {string} uid uid
 */
async function getFriend(uid) {
	try {
		// const result = await find('user', `uid IN (SELECT (CASE WHEN ownerUid='${uid}' THEN friendUid ELSE ownerUid END) AS uid FROM friend WHERE ownerUid='${uid}' OR friendUid='${uid}' )`);
		const result = await Sql(
			`SELECT u.uid,u.nickName, u.avatar, u.onlineStatus, u.sex, u.signature, f.notReadCount FROM user as u INNER JOIN friend as f ON f.friendUid=u.uid WHERE f.ownerUid='${uid}'`
		)
		return result
	} catch (error) {
		throw new Error('get friend fail')
	}
}

async function getMyOnlieFriend(uid) {
	return await Sql(
		`SELECT f.friendUid FROM friend as f INNER JOIN user as u ON f.friendUid = u.uid AND onlineStatus = 1 WHERE f.ownerUid='${uid}'`
	)
}

module.exports = {
	searchAccount,
	addFriend,
	getFriend,
	getMyOnlieFriend,
	isMyFriend
}
