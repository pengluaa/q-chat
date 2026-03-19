var Router = require('koa-router');
var router = new Router();

const {
  isEmail,
  isPhoneNum
} = require('../utils/common');
const {
  register,
  login,
  getUserInfoById,
  updateUser
} = require('../controller/account');
const {
  addFriend,
} = require('../controller/friend');
const {
  sendMessage
} = require('../controller/message');

const {
  chatAi: chatAiConfig
} = require("../config/index.config");


router.get('/owner', async (ctx, next) => {
  const result = await getUserInfoById(ctx.request.body._uid);
  ctx.body = result
});

// 编辑
router.put('/owner', async (ctx) => {
  const {
    _uid,
    avatar,
    password,
    nickName,
    signature
  } = ctx.request.body;
  await updateUser(_uid, {
    avatar,
    password,
    nickName,
    signature
  });
  ctx.status = 204;
})

router.get('/checkSession', async (ctx, next) => {
  ctx.body = {
    code: 200,
    msg: "is valid",
  };
});


router.post('/login', async (ctx, next) => {
  try {
    const {
      account,
      password
    } = ctx.request.body;
    ctx.body = await login(account, password);
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      code: -1,
      msg: 'login fail',
      content: '登陆失败'
    }
  }
})

router.post('/register', async (ctx, next) => {
  let {
    nickName,
    account,
    password
  } = ctx.request.body;
  nickName = (nickName || '').trim();
  account = (account || '').trim();
  password = (password || '').trim();

  if (!account || !nickName || !password) {
    ctx.status = 400;
    ctx.body = {
      msg: 'register params errror',
      content: '注册参数错误'
    };
    return;
  }

  if (!isEmail(account) && !isPhoneNum(account)) {
    ctx.status = 400;
    ctx.body = {
      msg: 'account errror',
      content: '注册账号错误'
    };
    return;
  }

  const datas = {
    nickName,
    password,
    account: account,
    ip: ctx.request.header['x-real-ip'],
  };

  if (isEmail(account)) {
    datas.email = account;
  }

  if (isPhoneNum(account)) {
    datas.phoneNumber = account;
  }

  const userInfo = await register(datas);
  // 添加笨笨机器人
  try {
    await addFriend(userInfo.uid, chatAiConfig.uid); // 没添加成功不用处理
    await sendMessage(userInfo.uid, chatAiConfig.uid, chatAiConfig.greetings);
  } catch (error) {}
  ctx.body = {
    msg: 'register ok',
    content: '注册成功'
  };
})


module.exports = router;