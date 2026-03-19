var Router = require('koa-router')
var router = new Router()
var {
	sendMessage,
	sendRoomMessage,
	getChatHistory,
	getRoomChatHistory,
	getMessageNotRead
} = require('../controller/message')

router.get('/', (ctx, next) => {
	sendMessage()
	ctx.body = 'hello message'
})

/**
 * @description msg notRead
 */
router.get('/notRead', async ctx => {
	ctx.body = await getMessageNotRead(ctx.request.body._uid)
})

/**
 * @description room history
 */
router.get('/history/room', async ctx => {
	const { _uid } = ctx.request.body
	const roomId = ctx.request.query.id
	const result = await getRoomChatHistory(roomId, _uid)
	result.forEach(item => {
		item.isSender = item.sendUid === _uid
	})
	ctx.body = result
})

/**
 * @description single history
 */
router.get('/history', async (ctx, next) => {
	const { _uid } = ctx.request.body
	const { uid } = ctx.request.query
	const result = await getChatHistory({
		sendUid: _uid,
		reciveUid: uid
	})

	result.forEach(item => {
		item.isSender = item.sendUid === _uid
	})
	ctx.body = result
})

/**
 * @description single send msg
 */
router.post('/send', async (ctx, next) => {
	const { content, uid, _uid } = ctx.request.body
	if (!content) {
		ctx.status = 400
		return Promise.reject('content not null')
	}

	const result = await sendMessage(uid, _uid, content)
	ctx.body = result
})

/**
 * @description room send msg
 */
router.post('/room/send', async ctx => {
	const { content, id, _uid } = ctx.request.body
	if (!content) {
		ctx.status = 400
		throw new Error('content can not null')
	}
	const result = await sendRoomMessage(_uid, id, content)
	ctx.body = result
})

module.exports = router
