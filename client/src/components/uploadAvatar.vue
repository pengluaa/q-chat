<template>
    <div>
        <div class="file-list avatar">
            <img v-imgLoad="{src: avatar, errorSrc: defalutIcon}" width="100%" alt="avatar">
        </div>
        <el-upload class="uload-wrap" :action="uploadUrl" :limit="1" accept="image/*" :headers="uploadHeaders" :on-success="handleSuccess" list-type="picture-card" enctype="multipart/form-data">
            <i class="el-icon-plus"></i>
        </el-upload>
    </div>
</template>
<script>
import { uploadUrl } from "../config";
export default {
  name: "avatarUploadComponent",
  data() {
    return {
      uploadUrl: uploadUrl + "upload",
      uploadHeaders: {
        Authorization: `SessionKey ${this.$globalData.session}`
      }
    };
  },

  props: {
    avatar: null,
    defalutIcon: null,
  },
  methods: {
    handleSuccess(resp) {
      if (resp.fileUrl) {
        this.$emit('success',resp.fileUrl);
      }
    }
  }
};
</script>
<style scoped>
.file-list {
  width: 148px;
  height: 148px;
  margin: 0 auto;
  border: 1px solid #cecece;
  border-radius: 50%;
}

.uload-wrap {
  position: absolute;
  width: 148px;
  height: 148px;
  overflow: hidden;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
}
</style>

