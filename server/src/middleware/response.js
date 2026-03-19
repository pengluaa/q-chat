const logger = require('../lib/logger')
/**
 * 响应处理模块
 */
module.exports = async function(ctx, next) {
	try {
		// 调用下一个 middleware
		await next()
		// 处理响应结果
		// 如果直接写入在 body 中，则不作处理
		// 如果写在 ctx.body 为空，则使用 state 作为响应

		ctx.body = ctx.body
			? ctx.body
			: {
					code: ctx.state.code !== undefined ? ctx.state.code : 0,
					data: ctx.state.data !== undefined ? ctx.state.data : {}
			  }
	} catch (e) {
		// catch 住全局的错误信息
		// console.log("error", e);
		logger(e)
		let [errorType, code, errMsg, errMsgContent] = (e.message || '').split(
			','
		)
		if (errorType === 'Error' && code) {
			code = Number(code) || -1
			errMsg = errMsg
			ctx.status = 500
		} else {
			code = -1
			errMsg = e.message || 'server error'
		}
		ctx.status = ctx.status || 500
		ctx.body = {
			code: code,
			error: errMsg,
			content: errMsgContent || null
		}
	}
}
