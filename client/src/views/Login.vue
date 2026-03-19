<template>
  <el-container>
    <div class="main-wrap">
      <!-- <img src="../assets/logo.png"> -->
      <p>登 录</p>
      <el-input v-model="form.account" prefix-icon="el-icon-mobile-phone" placeholder="账号"></el-input>
      <el-input v-model="form.password" prefix-icon="el-icon-view" placeholder="密码" type="password" @keyup.enter.native="login"></el-input>
      <el-button type="primary" :loading="showLoading" @click="login">登录</el-button>
      <p>还没有账号？
        <router-link to="/register">去注册</router-link>
      </p>
    </div>
  </el-container>
</template>

<script>
import { setSession } from "../service/session";
export default {
  name: "login",
  data() {
    return {
      form: {},
      showLoading: false
    };
  },

  mounted() {},

  methods: {
    login() {
      this.showLoading = true;
      this.axios({
        url: "account/login",
        method: "post",
        data: this.form
      })
        .then(
          res => {
            this.$message({
              message: "登录成功",
              type: "success"
            });
            setSession(res.sessionKey, res.expireTime);
            this.$globalData.userInfo = res;
            this.$globalData.session = res.sessionKey;
            this.$router.push("/index/single");
          },
          err => {
            this.$message({
              message: "账号或密码不正确",
              type: "warning"
            });
          }
        )
        .then(e => {
          this.showLoading = false;
        });
    }
  }
};
</script>

<style scoped>
.el-container {
  max-width: 450px;
  margin: 0 auto;
  padding: 200px 0;
}

.main-wrap {
  width: 100%;
  padding: 20px;
  color: #333;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
}

.main-wrap p {
  text-align: center;
}

.main-wrap a {
  color: #999;
  font-size: 13px;
}

.el-input,
.el-button {
  margin-top: 15px;
}

.el-button {
  width: 100%;
}
</style>
