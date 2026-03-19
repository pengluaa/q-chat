<template>
  <el-container class="index-container">
    <!-- <el-header>Header</el-header> -->
    <el-container>
      <div class="aside-nav-bar">
        <div class="avatar online">
          <img v-imgLoad="{src: ownerInfo.avatar, errorSrc: defalutIcon}"
               alt="avatar">
        </div>

        <ul>
          <template v-for="(nav, index) in navList">
            <li :key="index"
                :data-count="nav.newMsgCount"
                :class="{'current': currentIndex === nav.id,'new-msg': nav.newMsgCount > 0}"
                @click="navigateTo(nav, true)">
              <i :class="nav.icon"
                 class="iconfont"></i>
              <div>{{nav.txet}}</div>
            </li>
          </template>
        </ul>
        <el-popover placement="top"
                    width="160"
                    v-model="popoverVisible">
          <p>你确定退出聊天吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini"
                       type="text"
                       @click="popoverVisible = false">取消</el-button>
            <el-button type="primary"
                       size="mini"
                       @click="logout">确定</el-button>
          </div>
          <div slot="reference"
               class="exit-btn">
            <i class="iconfont icon-exit"></i>
          </div>
        </el-popover>

      </div>
      <el-main class="main">
        <!-- <router-view></router-view> -->
        <keep-alive :max="10"
                    exclude="setting">
          <component v-bind:is="currentComponent"></component>
        </keep-alive>
      </el-main>
    </el-container>
    <!-- <el-footer>Footer</el-footer> -->
  </el-container>

</template>
<script>
import { clearSession } from '@/service/session'
import DefalutIcon from '@/assets/icon-user-avatar.svg'
import {
  EVENT_HAS_READ_MSG,
  EVENT_GET_OWNER_INFO,
  EVENT_UPDATE_OWNER_INFO,
  EVENT_NEW_SINGLE_MSG,
  EVENT_NEW_ROOM_MSG,
  EVENT_TYPING,
  EVENT_ONLNIE_STATUS,
  ROOM,
  SINGLE,
  TYPING,
  ONLNIE_STATUS,
  ASIDE_ROOM_NUM,
  ASIDE_SINGLE_NUM
} from '@/service/constant'
import SingleComponent from '@/views/Single.vue'
import RoomComponent from '@/views/Room.vue'
import SearchComponent from '@/views/search.vue'
import SettingComponent from '@/views/setting.vue'

const msgListener = []

export default {
  name: 'index',
  data() {
    return {
      defalutIcon: DefalutIcon,
      ownerInfo: {},
      currentIndex: 1,
      popoverVisible: null,
      currentComponent: null,
      navList: [
        {
          id: 1,
          icon: 'icon-aside-chat',
          txet: '聊天',
          path: '/index/single',
          component: SingleComponent
        },
        {
          id: 2,
          icon: 'icon-aside-group',
          txet: '多人聊天',
          path: '/index/room',
          component: RoomComponent
        },
        {
          id: 3,
          icon: 'icon-search',
          txet: '搜索',
          path: '/index/search',
          component: SearchComponent
        },
        {
          id: 4,
          icon: 'icon-setting',
          txet: '设置',
          path: '/index/setting',
          component: SettingComponent
        }
      ]
    }
  },

  destroyed() {
    this.destroyedListener(msgListener)
    this.WS.removeAllListeners()
  },

  beforeMount() {
    // 个人信息
    this.getOwnerInfo()
    // 未读消息数量
    this.getNotReadMsgCountFromServer()
    // 显示状态
    this.handleCurrentShow(this.$route.path)
    // 监听路由变化
    this.$router.beforeEach((to, from, next) => {
      try {
        next()
        this.handleCurrentShow(to.path)
        /***
         * @descript 因为采用 keep-alive 组件 所以暂时用不上此方法
         * setTimeout(() => {
         *  this.emitMsg(EVENT_GET_OWNER_INFO, this.$globalData.userInfo);
         * }, 100);
         ***/
      } catch (error) {}
    })
  },

  mounted() {
    // SOCKET
    this.listenSocket()
    // update ownerInfo
    const listen1 = this.myListener.on(EVENT_UPDATE_OWNER_INFO, () => {
      this.getOwnerInfo()
    })

    // read msg
    const listen2 = this.myListener.on(EVENT_HAS_READ_MSG, (count, type) => {
      switch (type) {
        case SINGLE:
          this.navList[0].newMsgCount -= count
          break
        case ROOM:
          this.navList[1].newMsgCount -= count
          break
        default:
          break
      }
    })

    msgListener.push(listen1, listen2)
  },

  methods: {
    listenSocket() {
      this.WS.on('message', (type, data) => {
        console.log('global listenSocket:', type, data)
        switch (type) {
          // 多人聊天
          case ROOM:
            this.$notify({
              title: '消息',
              message: '你有新的聊天消息',
              type: 'success',
              iconClass: 'el-icon-message'
            })
            this.myListener.emit(EVENT_NEW_ROOM_MSG, data)
            break
          // 个人聊天
          case SINGLE:
            if (!data.isAiBenBen) {
              this.$notify({
                title: '消息',
                message: '你有新的个人消息',
                type: 'success',
                iconClass: 'el-icon-message'
              })
            }
            this.myListener.emit(EVENT_NEW_SINGLE_MSG, data)
            break

          // 打字状态
          case TYPING:
            this.myListener.emit(EVENT_TYPING, data)
            break

          // 在线状态
          case ONLNIE_STATUS:
            this.myListener.emit(EVENT_ONLNIE_STATUS, data)
            break

          default:
            break
        }

        this.checkMsg(type, 1)
      })
    },

    emitMsg(event, data) {
      this.myListener.emit(event, data)
    },

    getOwnerInfo() {
      this.axios({
        url: '/account/owner'
      }).then(res => {
        this.ownerInfo = res
        this.$globalData.userInfo = res
        this.emitMsg(EVENT_GET_OWNER_INFO, res)
      })
    },

    // 向服务器获取未读消息数量
    getNotReadMsgCountFromServer() {
      this.axios({
        url: '/message/notRead'
      }).then(res => {
        for (const k in res) {
          this.checkMsg(k, res[k])
        }
      })
    },

    // check msg
    checkMsg(type, count) {
      switch (type) {
        case ROOM:
          this.handleMsgState(ASIDE_ROOM_NUM, count)
          break
        case SINGLE:
          this.handleMsgState(ASIDE_SINGLE_NUM, count)
          break

        default:
          break
      }
    },

    // 处理左侧显示状态
    handleMsgState(index, count) {
      try {
        const oldCount = this.navList[index - 1].newMsgCount || 0
        this.$set(this.navList[index - 1], 'newMsgCount', oldCount + count)
      } catch (error) {}
    },

    logout() {
      try {
        this.$router.push('/login')
        clearSession()
        this.WS.close()
      } catch (error) {}
    },

    handleCurrentShow(path) {
      for (const nav of this.navList) {
        if (nav.path === path) {
          this.navigateTo(nav)
          break
        }
      }
    },

    navigateTo(nav, needPush = false) {
      this.currentIndex = nav.id
      this.currentComponent = nav.component
      if (needPush) {
        this.$router.push(nav.path);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-main {
  padding: 0 !important;
}
/** aside nav bar start**/
.aside-nav-bar {
  width: 100px;
  min-width: 100px;
  height: 100%;
  padding: 60px 0;
  text-align: center;
  box-sizing: border-box;
  background-color: #fafbff;
  position: relative;
}

.aside-nav-bar .avatar {
  width: 65px;
  height: 65px;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
}

.aside-nav-bar .exit-btn {
  position: absolute;
  bottom: 80px;
  width: 100%;
  color: #6f6f6f;
  cursor: pointer;
}

.aside-nav-bar .exit-btn:hover {
  color: #667efc;
}

.aside-nav-bar .iconfont {
  font-size: 30px;
}
.aside-nav-bar li div {
  margin-top: 5px;
}

.aside-nav-bar li:hover {
  color: #667efc;
}

.aside-nav-bar li.current {
  color: #667efc;
}

.avatar {
  position: relative;
}

.avatar::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  left: 3px;
  top: 3px;
  border: 2px solid #fafbff;
  border-radius: 50%;
  visibility: hidden;
}

.avatar.online::before {
  background-color: #49ff3e;
  visibility: visible;
}

.avatar.offline::before {
  background-color: #ff4e45;
  visibility: visible;
}

.aside-nav-bar ul {
  font-size: 0;
  padding: 0;
  margin-top: 60px;
  text-decoration-line: none;
  list-style: none;
}
.aside-nav-bar ul li {
  padding: 10px 0;
  margin: 20px 0;
  color: #b9babc;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}

.aside-nav-bar ul li.new-msg::after {
  content: attr(data-count);
  position: absolute;
  padding: 2px 5px;
  text-align: center;
  top: 15px;
  right: 10px;
  font-size: 11px;
  color: white;
  background-color: #ff5722;
  border-radius: 10px;
}

.aside-nav-bar ul li::before {
  content: '';
  position: absolute;
  width: 5px;
  height: 100%;
  left: -1px;
  top: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.aside-nav-bar ul li:hover::before {
  background-color: #b9babc;
}

.aside-nav-bar ul li.current::before {
  background-color: #667efc;
}

.aside-nav-bar ul li img {
  width: 30px;
}

/** aside nav bar end**/

.input-wrap input {
  border: none;
  font-size: 20px;
}

.index-container {
  position: relative;
  width: 100%;
  max-width: 1600px;
  overflow: hidden;
  padding: 12vh 10vw;
  height: 100%;
  /* margin: 0 auto; */
}

.online-left {
  display: flex;
  height: 100%;
  background-color: #f7fcff;
}

.online-left .avatar {
  min-width: 50px;
  width: 50px;
  height: 50px;
}

.online-left .avatar::before {
  width: 8px;
  height: 8px;
  left: 2px;
  top: 2px;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.friend-box {
  min-width: 270px;
  max-width: 270px;
  background-color: #f7fcff;
}

.friend-box .item {
  padding: 15px 10px 15px 15px;
  font-weight: 500;
  align-items: center;
  border-bottom: 1px solid #e7ebff;
  position: relative;
}

.friend-box .item.not-read::after {
  content: attr(data-count);
  position: absolute;
  display: block;
  border-radius: 10px;
  right: 10px;
  top: 35px;
  font-size: 11px;
  padding: 2px 5px;
  background-color: #ff5722;
  color: white;
}

.chat-box.friend-box {
  width: 100%;
  max-width: 100%;
  padding: 0 40px;
  background-color: white;
  overflow: hidden;
}

.friend-box .item.hover:hover {
  cursor: pointer;
  background-color: #98a9ff;
  color: white;
}
.friend-box .item.hover.current {
  background-color: #667efc;
}

.friend-box .item.hover:hover .right,
.friend-box .item.hover.current .right {
  color: white;
}

.friend-box .item.hover:hover .name,
.friend-box .item.hover.current .name {
  color: white;
}

.friend-box .item .right {
  width: 100%;
  line-height: 1.5;
  color: #b9babc;
  padding-left: 10px;
  text-align: left;
  overflow: hidden;
}

.friend-box .right .content {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.friend-box .m-t {
  justify-content: space-between;
}

.friend-box .m-t .name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.friend-box .m-t .time {
  font-size: 11px;
  max-width: 50px;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
}

.online-left .name {
  vertical-align: middle;
}

.main {
  background-color: #f2f4ff;
  color: #333;
  padding: 0;
  overflow: hidden;
}

.no-more {
  padding: 0 20px;
  margin: 30px 0;
  text-align: center;
  color: #afafaf;
}

@media screen and (max-width: 1660px) {
  .index-container {
    padding: 5vh 6vw;
  }
}
</style>
