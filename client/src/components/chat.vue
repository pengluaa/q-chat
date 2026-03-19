<template>
  <div class="chat-box friend-box" v-if="chatInfo">
    <div class="item flex">
      <div class="avatar">
        <img v-imgLoad="{src: chatInfo.avatar || chatInfo.logo, errorSrc: defaultIcon}">
      </div>
      <div class="right">
        <div class="m-t flex">
          <span class="name">{{chatInfo.nickName || chatInfo.name}}</span>
          <!-- <span class="time"></span> -->
        </div>
        <div class="content">{{chatInfo.content || chatInfo.signature || chatInfo.postscript || ''}}</div>
      </div>
    </div>
    <!-- chat wrap -->
    <div class="chat-container">
      <div id="chatWrap" class="chat-wrap">
        <template v-for="item in chatHistory">
          <div :key="item.id" :class="item.isSender ?'sender': ''" class="chat-item">
            <div>
              <div v-if="!item.isSender && showAvatar" class="avatar room-avatar">
                <img v-if="item.userInfo.avatar" :src="item.userInfo.avatar">
                <span>{{item.userInfo.surname}}</span>
              </div>
              <div class="content">{{item.content | decodeContent}}</div>
            </div>
            <div class="time">{{item.time | dateTime}}</div>
          </div>
        </template>
        <div class="no-more" v-if="chatHistory && chatHistory.length === 0">没有聊天内容，说点什么吧</div>
      </div>
      <inputComponent ref="inputRef" @input="handleInput" @send="sendMessage"> </inputComponent>
    </div>
  </div>
  <div v-else class="chat-box friend-box no-chat-wrap">
    <img src="@/assets/img-coding.svg">
    <!-- <img src="@/assets/img-coding2.svg"> -->
    <!-- <img src="@/assets/scrum_board.svg"> -->
    <p class="no-more">点击聊天窗口进行对话</p>
  </div>

</template>
<script>
import InputComponent from "@/components/input";
import defaultUserIcon from "@/assets/icon-user-avatar.svg";
import defaultRoomIcon from "@/assets/icon-group-avatar.svg";

import { ROOM, SINGLE } from "@/service/constant";

export default {
  name: "chatComponent",
  components: {
    inputComponent: InputComponent
  },
  data() {
    return {
      defaultIcon: defaultUserIcon
    };
  },
  props: {
    chatHistory: Array,
    showAvatar: Boolean,
    chatInfo: null
  },

  watch: {
    chatHistory: {
      handler(val, old) {
        this.$nextTick().then(() => {
          this.chatScorllToBottom();
        });
      },
      deep: false
    },

    chatInfo: function(oldval, newval) {
      console.log("chatInfo", oldval, newval);
    }
  },

  methods: {
    sendMessage(content) {
      this.$emit("send", content);
    },

    handleInput(val) {
      this.$emit("input", val);
    },

    clearInput() {
      this.$refs["inputRef"].clear();
    },

    /**
     *
     * @param {boolean} animate 是否动画 default = false
     *
     */
    chatScorllToBottom(animate) {
      try {
        const el = document.querySelector("#chatWrap"),
          scrollHeight = el.scrollHeight;
        let top = el.scrollTop,
          animationFrameId = null;
        const STEP_NUM = Math.floor(scrollHeight / 10);
        const scroll = () => {
          el.scrollTop = top;
          if (scrollHeight >= top) {
            animationFrameId = window.requestAnimationFrame(scroll);
          } else {
            window.cancelAnimationFrame(animationFrameId);
          }
          top += STEP_NUM;
        };
        if (animate) {
          animationFrameId = window.requestAnimationFrame(scroll);
        } else {
          el.scrollTop = scrollHeight;
        }
      } catch (error) {}
    }
  }
};
</script>
<style scoped>
.room-avatar {
  display: inline-block;
  width: 35px;
  min-width: 35px;
  height: 35px;
  line-height: 35px;
  border-radius: 50%;
  text-align: center;
  vertical-align: bottom;
  color: white;
  font-weight: 12px;
  background-color: #667efc;
}

.no-chat-wrap {
  text-align: center;
}

.no-chat-wrap img {
  max-width: 450px;
  margin-top: 100px;
}

.chat-container {
  height: 100%;
}

.chat-container .chat-wrap {
  height: calc(100% - 150px);
  /* padding: 20px 0; */
  overflow-y: scroll;
}

.chat-container .chat-item {
  margin-top: 15px;
}

.chat-container .chat-item .time {
  padding: 5px 0;
  font-size: 11px;
  color: #b9babc;
  user-select: none;
}

.chat-container .chat-item .content {
  display: inline-block;
  min-width: 200px;
  max-width: 60%;
  padding: 15px 20px;
  line-height: 1.8;
  font-weight: 500;
  font-size: 14px;
  border-radius: 20px 30px 30px 0;
  box-shadow: 0px 5px 15px -5px rgba(153, 153, 153, 0.2);
  background-color: #667efc;
  color: white;
  /* user-select: none; */
}

.chat-item.sender {
  text-align: end;
  margin-right: 10px;
}

.chat-item.sender .content {
  text-align: start;
  border-radius: 30px 20px 0 30px;
  background-color: rgba(242, 242, 244, 0.36);
  color: #333;
  box-shadow: 5px 5px 5px #efefef;
}
</style>
