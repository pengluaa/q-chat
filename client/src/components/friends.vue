<template>
  <div class="friend-box">
    <template v-for="(data,index) in datas">
      <div class="item hover flex" :data-count="data.notReadCount" :class="{ current: index === currentIndex, 'not-read': data.notReadCount>0 }" :key="data.uid" @click="showChat(index)">
        <div class="avatar" :class="{online: data.onlineStatus,offline: data.onlineStatus===0}">
          <img v-imgLoad="{src: data.avatar || data.logo, errorSrc: defalutIcon}">
        </div>
        <div class="right">
          <div class="m-t flex">
            <span class="name">{{data.nickName|| data.name || ''}}</span>
            <span class="time">{{data.last.time | time}}</span>
          </div>
          <div class="content">{{ data.last.content | decodeContent}}</div>

          <i v-if="data.showMenu" class="menu el-icon-more" @click.stop="clickMenu(data)"></i>
        </div>
      </div>
    </template>
    <div v-if="!datas" v-loading="true" element-loading-text="拼命加载中" element-loading-background="#f7fcff" class="loading-wrap"></div>
    <div v-else-if="datas.length === 0" class="no-more">
      <span>{{noDataText}}</span>
      <el-button type="text" @click="toSearchView">去添加</el-button>
    </div>
  </div>
</template>

<script>
import defaultUserIcon from "@/assets/icon-user-avatar.svg";

import { ASIDE_SEARCH_NUM } from "@/service/constant";

export default {
  name: "friendsComponent",
  data() {
    return {
      currentIndex: null
    };
  },

  props: {
    datas: {
      type: Array,
      default: null
    },
    toViewPath: {
      type: String,
      default: "/index/search"
    },
    defalutIcon: {
      type: null,
      default: defaultUserIcon
    },
    noDataText: {
      type: String,
      default: "还没有好友哦，添加好友进行聊天吧"
    }
  },

  watch: {},

  methods: {
    toSearchView() {
      this.$router.push(this.toViewPath);
    },

    clickMenu(item) {
      this.$emit("clickMenu",item);
    },

    // 聊天
    showChat(index) {
      this.$emit("show", index);
      this.currentIndex = index;
    }
  }
};
</script>

<style scoped>
.loading-wrap {
  height: 250px;
}
.right .menu {
  position: absolute;
  right: 20px;
  bottom: 25px;
  transform: rotate(90deg);
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 4px;
  color: white;
}
.right .menu:hover {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
