<template>
  <div class="online-left">
    <friendsComponent @show="showChat" :datas="friendList"> </friendsComponent>
    <chatComponent ref="chatRef" @input="handleInput" :chatHistory="chatList" :chatInfo="showItem" @send="sendMessage"></chatComponent>
  </div>
</template>
<script>
import friendsComponent from "@/components/friends";
import chatComponent from "@/components/chat";

import {
  EVENT_HAS_READ_MSG,
  EVENT_NEW_SINGLE_MSG,
  EVENT_TYPING,
  EVENT_ONLNIE_STATUS,
  EVENT_ADD_FRIEND,
  ASIDE_SINGLE_NUM,
  SINGLE,
  TYPING
} from "@/service/constant";

const msgListener = [];
const SEND_TYPING_MAX_TIME = 30;
let lastSendTime = null; // 进入页面时间
let hasSendTyping = null; //已经发送过typing消息（在来新消息之后更新typing状态）
let timer = null;
function getTimestamp(time) {
  if (time) {
    return Math.ceil(new Date(time).getTime() / 1000);
  } else {
    return Math.ceil(new Date().getTime() / 1000);
  }
}
export default {
  name: "single",
  components: {
    friendsComponent,
    chatComponent
  },
  data() {
    return {
      currentIndex: null,
      friendList: null,
      showItem: null,
      chatList: null
    };
  },
  destroyed() {
    this.destroyedListener(msgListener);
  },

  async mounted() {
    await this.getOnlineList();
    this.listenAddFriend();
    this.listenMessage();
    this.listenTyping();
    this.listenOnlieStatus();

  },

  methods: {
    // 聊天
    async showChat(index) {
      try {
        const currentItem = this.friendList[index];
        if (!currentItem) {
          return;
        }
        this.showItem = currentItem;
        this.chatList = await this.getChatById(currentItem.uid);
        this.myListener.emit(
          EVENT_HAS_READ_MSG,
          currentItem.notReadCount,
          SINGLE
        ); // 发送已读通知
        this.friendList[index].notReadCount = 0;
        lastSendTime = getTimestamp(this.chatList.slice(-1)[0].time);
      } catch (error) {}
    },

    // 处理输入
    handleInput(val) {
      if (
        hasSendTyping ||
        getTimestamp() - lastSendTime > SEND_TYPING_MAX_TIME
      ) {
        // console.log("expried");
        return;
      }
      this.WS.send(TYPING, {
        uid: this.showItem.uid
      });

      hasSendTyping = true;
    },

    listenAddFriend() {
      const listen = this.myListener.on(EVENT_ADD_FRIEND, () => {
        this.getOnlineList();
       });
        msgListener.push(listen);       
    },

    /**
     * @deprecated 监听打字
     */
    listenTyping() {
      const listen = this.myListener.on(EVENT_TYPING, datas => {
        const showItem = this.showItem;
        if (!showItem) {
          return;
        }

        if (showItem.uid === datas.uid) {
          // 对面正在typing
          this.$set(this.showItem, "content", "对方正在输入..");
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(() => {
            this.$set(this.showItem, "content", null);
          }, SEND_TYPING_MAX_TIME * 500); // 15s
        }
      });
      msgListener.push(listen);
    },

    // 监听好友上线状态
    listenOnlieStatus() {
      const listen = this.myListener.on(EVENT_ONLNIE_STATUS, data => {
        const fUid = data.uid;
        const friendList = this.friendList;
        for (let i = 0; i < friendList.length; i++) {
          if (friendList[i].uid === fUid) {
            this.$set(this.friendList[i], "onlineStatus", data.status);
            break;
          }
        }
      });

      msgListener.push(listen);
    },

    // 监听新消息
    listenMessage() {
      const listen = this.myListener.on(EVENT_NEW_SINGLE_MSG, data => {
        if (!this.chatList) {
          this.chatList = [];
        }

        // 判断在线列表
        if (!this.friendList || !this.friendList.length) {
          return;
        }
        if (this.showItem && data.sendUid === this.showItem.uid) {
          this.chatList.push(data);
          this.getChatById(data.sendUid);
          // 阅读了一条
          this.myListener.emit(EVENT_HAS_READ_MSG, 1, SINGLE); // 发送已读通知
          lastSendTime = getTimestamp(); // 更新已读时间
          hasSendTyping = false;
          clearTimeout(timer);
          this.$set(this.showItem, "content", null);
          return;
        }

        // 查找房间给好友未读数加1
        for (let i = 0; i < this.friendList.length; i++) {
          const item = this.friendList[i];
          // uid === sendUid
          if (item.uid === data.sendUid) {
            item.notReadCount++;
            item.last = data;
            this.$set(this.friendList, i, item);
            break;
          }
        }
      });

      msgListener.push(listen);
    },

    async getChatById(uid) {
      const res = await this.axios({
        url: "message/history",
        params: {
          uid
        }
      });
      return res || [];
    },

    async getOnlineList() {
      const res = await this.axios({
        url: "friend/list",
        method: "get"
      });
      this.friendList = (res || []).filter(item => item && item.uid);
      return;
    },

    // 发送消息
    sendMessage(content) {
      if(this.sendMessage._lock) { return;}
      if (!this.showItem) {
        this.$message({
          showClose: true,
          message: "还没有选择好友哦",
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
        url: "message/send",
        method: "post",
        data: {
          uid: this.showItem.uid,
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

