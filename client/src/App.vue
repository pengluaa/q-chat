<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body,
ul,
li,
dl,
dt {
  margin: 0;
  padding: 0;
}
#app {
  width: 100vw;
  height: 100vh;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  background: linear-gradient(45deg, #6078f0, #627af4);
}

.flex {
  display: flex;
  display: -webkit-flex;
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
  border-radius: 10px;
  width: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: #ccc;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: #eee;
}
</style>
