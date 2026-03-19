<template>
  <div class="input-wrap flex">
    <el-input v-model="inputVal" @input="handleInput" clearable @keyup.enter.native="send" placeholder="请输入内容">
    </el-input>
    <div class="handle-warp flex">
      <div class="icon">
        <el-popover @show="() => this.showEmoji = true" @hide="() => this.showEmoji = false" placement="top" title="表情" width="300" trigger="click">
          <i slot="reference" class="iconfont icon-emoji"></i>
          <div class="emoji-item" v-for="(emoji, index) in emojiList" @click="chooseEmoji(emoji)" :key="index">{{ emoji }}</div>
        </el-popover>
      </div>
      <div class="icon send-btn" @click="send">
        <i class="iconfont icon-send"></i>
      </div>
    </div>
  </div>
</template>

<script>
const Emoji_List = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😃",
  "😄",
  "😅",
  "😆",
  "😉",
  "😊",
  "😋",
  "😎",
  "😍",
  "😘",
  "😗",
  "😙",
  "😚",
  "🙂",
  "🤗",
  "🤩",
  "🤔",
  "🤨",
  "😐",
  "😑",
  "😶",
  "🙄",
  "😏",
  "🤐",
  "😴",
  "😜",
  "😓",
  "😭",
  "😲",
  "🤞",
  "🖖",
  "👌",
  "👍",
  "👎",
  "✊",
  "👊",
  "💔"
];
export default {
  name: "inputComponent",
  data() {
    return {
      inputVal: null,
      showEmoji: null,
      emojiList: Emoji_List
    };
  },
  props: {
    value: [String, Number]
  },

  mounted() {},

  methods: {
    send() {
      this.$emit("send", encodeURIComponent(this.inputVal || ""));
    },

    handleInput(val) {
      this.$emit("input", val);
    },
    
    chooseEmoji(emoji) {
      this.inputVal = (this.inputVal || "") + emoji;
    },

    clear() {
      this.inputVal = "";
    }
  }
};
</script>
<style scoped>
.input-wrap {
  height: 70px;
  align-items: center;
  position: relative;
  justify-content: space-between;
}

.input-wrap::after {
  content: "";
  position: absolute;
  top: 1px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #ebeeff;
}

.input-wrap .el-input {
  min-width: 80%;
}

.input-wrap .handle-warp {
  padding-right: 40px;
  width: 100%;
  justify-content: flex-end;
}

.handle-warp .icon {
  position: relative;
  padding-left: 20px;
  cursor: pointer;
  text-align: center;
}
.handle-warp .icon .iconfont {
  font-size: 30px;
  outline: none;
}

.handle-warp .icon:hover {
  color: #667efc;
}


.emoji-item {
  display: inline-block;
  font-size: 24px;
  transform-origin: center;
  cursor: pointer;
  margin: 2px;
  user-select: none;
}
.emoji-item:hover {
  transform: scale(1.5);
  /* background-color: rgba(255, 255, 255, 1); */
  animation: move 1s ease-in-out infinite;
}

@keyframes move {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style>
