const Router = require('koa-router');
const router = new Router();
const accountRoute = require('./account');
const messageRoute = require('./message');
const friendRoute = require('./friend');
const roomRoute = require('./room');

router.all('/',(ctx,next)=>{
  ctx.status=204;
})

router.all('/index',(ctx,next)=>{
  ctx.body = 'hello index';
})

router.use('/account',accountRoute.routes(),accountRoute.allowedMethods());
router.use('/message',messageRoute.routes(),messageRoute.allowedMethods());
router.use('/friend',friendRoute.routes(),friendRoute.allowedMethods());
router.use('/room',roomRoute.routes(),roomRoute.allowedMethods());

module.exports = router;