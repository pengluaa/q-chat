var Router = require('koa-router');
var router = new Router();

const {
    createRoom,
    getOwnerRoom,
    searchRoom,
    addMember,
    updateRoom
} = require('../controller/room');

router.all('/', (ctx) => {
    ctx.body = 'room';
})
/**
 * @description 获取我的房间
 */
router.get('/list', async (ctx) => {
    const result = await getOwnerRoom(ctx.request.body._uid);
    ctx.body = result;
})

router.post('/addMember', async (ctx) => {
    const {
        _uid,
        id
    } = ctx.request.body;
    await addMember(_uid, id);
    ctx.status = 204;
});

/**
 * @description 搜索房间
 */
router.get('/search', async (ctx) => {
    const { keyword } = ctx.request.query;
    const result = await searchRoom(keyword, ctx.request.body._uid);
    ctx.body = result;
})


/**
 * 
 * @description 校验表单数据 
 */
function validRoomForm(name, roomNo, postscript) {
    const roomNoLen = String(roomNo || '').length;
    if (!name) {
        throw new Error(["Error", 500, "name not null"]);
    }

    if (!postscript) {
        throw new Error(["Error", 500, "postscript not null"]);
    }
    if(!roomNo) {return true;}

    // 下面校验房间号
    if ("number" !== typeof roomNo) {
        throw new Error(["Error", 500, "roomNo need number"]);
    }

    if (roomNo < 1) {
        throw new Error(["Error", 500, "roomNo need >1"]);
    }

    if (roomNoLen < 6 || roomNoLen > 12) {
        throw new Error(["Error", 500, "roomNo need 6 to 12 digits"]);
    }

    return true;
}

router.post('/create', async (ctx) => {
    const {
        _uid,
        name,
        roomNo,
        postscript,
        logo
    } = ctx.request.body;
    validRoomForm(name, roomNo, postscript);
    await createRoom(_uid, name, roomNo, postscript, logo);
    ctx.status = 204;
})

router.put('/update', async (ctx) => {
    const {
        _uid,
        id,
        name,
        roomNo,
        postscript,
        logo
    } = ctx.request.body;
    if (!id) {
        ctx.throw("id not null");
    }

    validRoomForm(name, null, postscript);
    await updateRoom(id, _uid,name,postscript,logo);
    ctx.status = 204;

})

module.exports = router;