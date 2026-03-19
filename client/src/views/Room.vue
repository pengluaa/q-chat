<template>
  <div style="height:100%">
    <div class="online-left">
      <div class="banner">
        <ul class="items flex">
          <li v-for="item in tabList" :key="item.id" :class="{current:tabId === item.id}" @click="switchTab(item.id)">
            <i class="el-icon-plus" v-if="item.icon"></i>
            {{item.text}}
          </li>
          <transition>
            <div class="slider" :style="{left:(33.3 * tabId) +'%'}"></div>
          </transition>
        </ul>
        <friendsComponent :noDataText="noDataText" :defalutIcon="defalutIcon" @show="showChat" @clickMenu="editRoom" :datas="roomList"> </friendsComponent>
      </div>
      <chatComponent ref="chatRef" :chatHistory="chatList" :chatInfo="showItem" :showAvatar="true" @send="sendMessage"></chatComponent>
    </div>
    <el-dialog title="创建房间" :visible="dialogVisible" @close="this.closeDialog" width="700px">
      <el-form :model="roomModal" ref="roomModal" :rules="roomRules" label-width="100px">
        <el-form-item>
          <avatarComponent :avatar="roomModal.logo" :defalutIcon="defalutIcon" @success="this.handleSuccess" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="roomModal.name" autocomplete="off" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="房间号" prop="roomNo" show-word-limit>
          <el-input :disabled="!!roomModal.id" v-model="roomModal.roomNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="postscript" show-word-limit>
          <el-input v-model="roomModal.postscript" maxlength="100" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="newRoom">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import friendsComponent from "@/components/friends";
import chatComponent from "@/components/chat";
import AvatarComponent from "@/components/uploadAvatar";
import DefalutIcon from "@/assets/icon-group-avatar.svg";

import {
  ASIDE_ROOM_NUM,
  ROOM,
  EVENT_HAS_READ_MSG,
  EVENT_NEW_ROOM_MSG,
  EVENT_GET_OWNER_INFO,
  EVENT_ADD_ROOM,
} from "@/service/constant";

const msgListener = [];
export default {
  name: "room",
  components: {
    friendsComponent,
    chatComponent,
    avatarComponent: AvatarComponent
  },

  data() {
    return {
      noDataText: "还没有聊天室哦，添加或创建聊天室聊天吧",
      roomList: null,
      showItem: null,
      chatList: null,
      dialogVisible: null,
      tabId: 0,
      defalutIcon: DefalutIcon,
      ownerInfo: {},
      roomModal: {
        logo: null,
        name: null,
        roomNo: null,
        postscript: null
      },
      roomRules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
        ],
        roomNo: [
          { required: true, message: "请输入房间号", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 位数字", trigger: "blur" }
        ],
        postscript: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      tabList: [
        { id: 0, text: "全部", icon: "" },
        { id: 1, text: "我的", icon: "" },
        { id: 2, text: "新建", icon: true }
      ]
    };
  },

  destroyed() {
    this.destroyedListener(msgListener);
  },

  mounted() {
    this.ownerInfo = this.$globalData.userInfo || {};
    if (this.ownerInfo.uid) {
      this.getRoomList();
      return;
    }
    
    const listen = this.myListener.on(EVENT_GET_OWNER_INFO, userInfo => {
      this.ownerInfo = userInfo || {};
      this.getRoomList();
    });

    const listen2 = this.myListener.on(EVENT_ADD_ROOM, () => {
      this.getRoomList();
    });

    msgListener.push(listen, listen2);
  },

  methods: {
    switchTab(id) {
      const ownerId = this.ownerInfo.uid;
      switch (id) {
        case 0:
          this.roomList = this.tempRoomList;
          this.tabId = id;
          break;
        case 1:
          this.roomList = this.tempRoomList.filter(
            room => room.ownerUid === ownerId
          );
          this.tabId = id;
          break;
        case 2:
          this.dialogVisible = true;
          break;

        default:
          break;
      }
    },

    closeDialog() {
      this.$refs["roomModal"].resetFields();
      this.dialogVisible = false;
      this.roomModal = {};
    },

    handleSuccess(logo) {
      this.roomModal.logo = logo;
    },

    /**
     * @description 编辑房间
     */
    editRoom(room) {
      this.roomModal = {...room};
      this.dialogVisible = true;
    },

    /**
     * @description 新建房间
     */
    newRoom() {
      this.$refs["roomModal"].validate( async valid => {
        if (!valid) {
          return;
        }
        const roomModal = {...this.roomModal};
        roomModal.roomNo = Number(roomModal.roomNo);
        const isEdit = this.roomModal.id;
        await this.axios({
          url: isEdit ? "/room/update" : "/room/create",
          method: isEdit ? "put" : "post",
          data: roomModal,
          _errMsg: (isEdit ? "编辑" : "新建") + "失败，请重试"
        })
        this.dialogVisible = false;
        this.getRoomList();
        this.$message({
        showClose: true,
            message: (isEdit ? "编辑" : "新建") + "成功",
            type: "success"
        });
      });
    },

    // 聊天
    async showChat(index) {
      const currentItem = this.roomList[index];
      if (!currentItem) {
        return;
      }
      this.showItem = currentItem;
      this.chatList = await this.getChatById(currentItem.id);
      this.myListener.emit(EVENT_HAS_READ_MSG, currentItem.notReadCount, ROOM); // 发送已读通知
      this.roomList[index].notReadCount = 0;
    },

    // 发送消息
    sendMessage(content) {
      if(this.sendMessage._lock) { return;}
      if (!this.showItem) {
        this.$message({
          showClose: true,
          message: "还没有选择聊天室哦",
          type: "warning"
        });
        return;
      }

      if (!content) {
        this.$message({
          showClose: true,
          message: "请输入内容",
          type: "warning"
        });
        return;
      }
      this.sendMessage._lock = true;
      this.axios({
        url: "message/room/send",
        method: "post",
        data: {
          id: this.showItem.id,
          content: content
        }
      }).then(
        res => {
          if (!this.chatList) {
            this.chatList = [];
          }

          this.$refs["chatRef"].clearInput();
          this.chatList.push(res);
          this.sendMessage._lock = false;
        },
        () => {
          this.sendMessage._lock = false;
          this.$message({
            showClose: true,
            message: "消息发送失败，请重试",
            type: "error"
          });
        }
      );
    },

    async getChatById(roomId) {
      const res = await this.axios({
        url: "message/history/room",
        params: {
          id: roomId
        }
      });
      return res || [];
    },

    getRoomList() {
      this.axios({
        url: "room/list",
        method: "get"
      }).then(res => {
        const ownerId = this.ownerInfo.uid;
        (res || []).forEach(item => {
          item.showMenu = item.ownerUid === ownerId;
        });
        this.tempRoomList = res;
        this.switchTab(this.tabId);
        this.listenMessage();
      });
    },
    // 监听消息
    listenMessage() {
      const listner = this.myListener.on(EVENT_NEW_ROOM_MSG, data => {
        if (!this.chatList) {
          this.chatList = [];
        }
        if (!this.roomList || !this.roomList.length) {
          return;
        }
        if (this.showItem && data.roomId === this.showItem.id) {
          this.chatList.push(data);
          this.getChatById(data.roomId);
          this.myListener.emit(EVENT_HAS_READ_MSG, 1, ROOM); // 发送已读通知
          return;
        }
        // 查找房间给房间未读数加1
        for (let i = 0; i < this.roomList.length; i++) {
          const item = this.roomList[i];
          // roomId === id
          if (item.id === data.roomId) {
            item.notReadCount++;
            item.last = data;
            this.$set(this.roomList, i, item);
            break;
          }
        }
      });
      msgListener.push(listner); // 添加到listen(到时候销毁)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.banner .items {
  list-style: none;
  font-size: 0;
  padding: 20px 0;
  box-shadow: -5px 0px 10px rgba(199, 199, 199, 0.41);
  justify-content: space-around;
  align-items: center;
  position: relative;
}

.banner .items li.current {
  color: #667efc;
}

.banner .items::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 1px;
  left: 0;
  bottom: 0px;
  background-color: #e7ebff;
}

.banner .items .slider {
  position: absolute;
  width: 33.33%;
  height: 4px;
  left: 0;
  bottom: 0px;
  transform: scaleX(0.5);
  background-color: #667efc;
  transition: 0.3s all cubic-bezier(0, 0.04, 0, 1.91);
}

.banner .items li:hover {
  cursor: pointer;
  color: #667efc;
}

.banner .items li {
  flex: 1;
  text-align: center;
  font-size: 16px;
  color: #333;
}
</style>

