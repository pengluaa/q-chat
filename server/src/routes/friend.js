var Router = require('koa-router');
var router = new Router();
const {
    getLastMessage
} = require('../controller/message');

const {
    searchAccount,
    addFriend,
    getFriend
} = require('../controller/friend');

router.all('/', (ctx) => {
    ctx.body = '';
})

router.get('/list', async (ctx, next) => {
    try {
        const { _uid } = ctx.request.body;
        const result = await getFriend(_uid);
        for (const item of result) {
            item.last = await getLastMessage(_uid, item.uid);
        }
        ctx.body = result;
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            code: -1,
            msg: 'get friend fail',
            content: '获取好友失败'
        }
    }
})

router.get('/search', async (ctx, next) => {
    try {
        const { keyword } = ctx.request.query;
        const result = await searchAccount(keyword, ctx.request.body._uid);
        ctx.body = result
    } catch (error) {
        ctx.status = 500;
        ctx.body = error || {
            code: -1,
            msg: 'get user fail',
            content: '获取用户失败'
        }
    }
})

router.post('/add', async (ctx, next) => {
    const {
        _uid,
        uid
    } = ctx.request.body;
    if (_uid === uid) {
        ctx.status = 500;
        ctx.body = {
            code: -1,
            msg: 'you not add self',
            content: '不能添加自己为好友'
        }
        return;
    }
    await addFriend(_uid, uid);
    ctx.status = 204
})

module.exports = router;