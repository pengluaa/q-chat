var Koa = require('koa');
var app = new Koa();

var router = require('./routes/index');
var socketIo = require('./controller/socket.io');
const cros = require('./middleware/cros');
const response = require('./middleware/response');
const bodyParser = require('koa-bodyparser');
// const bodyParser = require('./middleware/bodyParser');
const authMidWare = require('./middleware/auth');

const configs = require('./config/index.config');

app.use(cros);//解决跨域 middleware
app.use(response);//处理响应 middlewar
// body parser
app.use(bodyParser({
  onerror: (err, ctx) => {
    ctx.throw('body parse error', 422);
  }
}));
app.use(authMidWare);//处理auth middlewar
socketIo(app, configs.socketPort);

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(configs.port);