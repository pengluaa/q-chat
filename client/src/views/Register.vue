<template>
  <el-container>
    <div class="main-wrap">
      <!-- <img src="../assets/logo.png"> -->
      <el-form :rules="rules"
               :model="form"
               ref="ruleForm">
        <p>账号注册</p>
        <el-form-item prop="nickName">
          <el-input v-model="form.nickName"
                    prefix-icon="el-icon-info"
                    placeholder="昵称"></el-input>
        </el-form-item>

        <el-form-item prop="account">
          <el-input v-model="form.account"
                    prefix-icon="el-icon-mobile-phone"
                    placeholder="手机号或邮箱"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="form.password"
                    prefix-icon="el-icon-view"
                    placeholder="密码"
                    type="password"></el-input>
        </el-form-item>

        <el-form-item prop="comfirmPassword">
          <el-input v-model="form.comfirmPassword"
                    prefix-icon="el-icon-view"
                    placeholder="确认密码"
                    type="password"></el-input>
        </el-form-item>

        <el-button type="primary"
                   :loading="showLoading"
                   @click="register">注册</el-button>
      </el-form>
      <p>
        <router-link to="/login">返回登录</router-link>
      </p>
    </div>
  </el-container>
</template>

<script>
export default {
  name: 'register',
  data() {
    return {
      form: {},
      showLoading: false,
      rules: {
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入手机号或邮箱', trigger: 'blur' },
          { max: 30, message: '长度不超过 30 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少6个个字符', trigger: 'blur' }
        ],
        comfirmPassword: [
          { required: true, message: '再次输入密码', trigger: 'blur' }
        ]
      }
    }
  },

  mounted() {},

  methods: {
    register() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return

        if (this.form.password !== this.form.comfirmPassword) {
          this.$message({
            message: '两次密码输入不一致',
            type: 'warning'
          })
          return
        }

        this.axios({
          url: 'account/register',
          method: 'post',
          _errMsg: '注册失败',
          data: this.form
        })
          .then(res => {
            this.$message({
              message: '注册成功',
              type: 'success'
            })
            this.$router.push('/login')
          })
          .catch(err => {});
      })
    }
  }
}
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

.el-button {
  margin-top: 15px;
}

.el-button {
  width: 100%;
}
</style>
