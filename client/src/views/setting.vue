<template>
  <div class="wrap">
    <el-form :model="formModal" status-icon :rules="rules" ref="formModal" label-width="100px" class="demo-ruleForm">
      <el-form-item v-show="!state1" style="text-align:center;">
        <avatarComponent :avatar="formModal.avatar" :defalutIcon="defalutIcon" @success="this.handleSuccess" />
      </el-form-item>

      <el-form-item>
        <el-switch v-model="state1" :checked="state1" inactive-text="使用网络地址" active-color="#13ce66"></el-switch>
      </el-form-item>

      <el-form-item label="图片地址" prop="avatar" v-show="state1">
        <el-input type="text" v-model="formModal.avatar" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input type="text" v-model="formModal.nickName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="个人签名" prop="signature">
        <el-input type="text" v-model="formModal.signature" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-switch v-model="state2" active-color="#13ce66" inactive-text="修改密码"></el-switch>
      </el-form-item>
      <template>
        <el-form-item label="密码" prop="pass" v-show="state2">
          <el-input type="password" v-model="formModal.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" v-show="state2">
          <el-input type="password" v-model="formModal.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="submit('formModal')">提交</el-button>
        <el-button @click="resetForm('formModal')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import DefalutIcon from "@/assets/icon-user-avatar.svg";
import AvatarComponent from "@/components/uploadAvatar";

import {
  EVENT_GET_OWNER_INFO,
  EVENT_UPDATE_OWNER_INFO
} from "@/service/constant";

const msgListener = [];
export default {
  name: "setting",
  components: {
    avatarComponent: AvatarComponent
  },
  data() {
    return {
      formModal: {
        nickName: "",
        signature: "",
        avatar: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [{ trigger: "blur" }],
        nickName: [
          {
            trigger: "blur",
            required: true,
            min: 1,
            max: 20,
            message: "请输入昵称"
          }
        ],
        checkPass: [{ trigger: "blur" }],
        age: [{ trigger: "blur" }]
      },
      defalutIcon: DefalutIcon,
      state1: false,
      state2: false
    };
  },

  destroyed() {
    this.destroyedListener(msgListener);
  },

  mounted() {
    this.setUserInfo(this.$globalData.userInfo);
    const listen = this.myListener.on(EVENT_GET_OWNER_INFO, this.setUserInfo);
    msgListener.push(listen);
  },

  methods: {
    submit(formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) {
          return false;
        }
        await this.axios({
          url: "/account/owner",
          method: "put",
          data: this[formName]
        });
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        this.myListener.emit(EVENT_UPDATE_OWNER_INFO, null);
      });
    },

    handleSuccess(avatar) {
      this.formModal.avatar = avatar;
    },

    setUserInfo(userInfo) {
      try {
        this.formModal.nickName = userInfo.nickName;
        this.formModal.signature = userInfo.signature;
        this.formModal.avatar = userInfo.avatar;
      } catch (error) {}
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.el-form {
  position: absolute;
  min-width: 500px;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  padding: 20px 40px 0 0;
}

.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("../assets/scrum_board.svg") no-repeat;
  background-size: 3700px;
  background-color: rgb(150, 140, 255);
  background-position: right;
}
</style>

