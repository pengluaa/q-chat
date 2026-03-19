  <template>
  <div style="padding:20px;">
    <el-tabs type="border-card"
             class="tabs-wrap">
      <el-tab-pane label="添加好友">
        <el-row class="flex">
          <el-input icon="search"
                    placeholder="昵称搜索或用户号搜索"
                    v-model="keyword"
                    @keyup.enter.native="getAccountList"
                    class="search-input" />
          <el-button type="primary"
                     icon="el-icon-search"
                     @click="getAccountList">搜索</el-button>
        </el-row>
        <el-table v-loading="loading"
                  :data="accountList"
                  style="width: 100%"
                  height="450"
                  :expand-row-keys="currentKey"
                  row-key="id">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left"
                       inline
                       class="demo-table-expand">
                <el-form-item label="昵称">
                  <span>{{ props.row.nickName }}</span>
                </el-form-item>
                <el-form-item label="性别">
                  <span>{{ props.row.sex | sex}}</span>
                </el-form-item>
                <el-form-item label="用户ID">
                  <span>{{ props.row.uid }}</span>
                </el-form-item>
                <el-form-item label="签名">
                  <span>{{ props.row.signature || '-' }}</span>
                </el-form-item>
                <el-form-item label="生日">
                  <span>{{ props.row.birthday | birthday }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="用户id"
                           prop="uid">
          </el-table-column>
          <el-table-column label="昵称"
                           prop="nickName">
          </el-table-column>
          <el-table-column label="操作"
                           prop="">
            <template slot-scope="scope">
              <el-button size="mini"
                         @click="handleEdit(scope.$index, scope.row)">查看</el-button>
              <el-button size="mini"
                         type="primary"
                         @click="addFriend(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="添加聊天室">
        <el-row class="flex">
          <el-input icon="search"
                    placeholder="搜索房间号或房间名"
                    v-model="keyword2"
                    @keyup.enter.native="getRoomList"
                    class="search-input" />
          <el-button type="primary"
                     icon="el-icon-search"
                     @click="getRoomList">搜索</el-button>
        </el-row>
        <el-table :data="roomList"
                  style="width: 100%"
                  height="450"
                  :expand-row-keys="currentKey"
                  row-key="id">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left"
                       inline
                       class="demo-table-expand">
                <el-form-item label="房间名">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="类型">
                  <span>{{ props.row.type | sex}}</span>
                </el-form-item>
                <el-form-item label="总人数">
                  <span>{{ props.row.total }}</span>
                </el-form-item>
                <el-form-item label="成员">
                  <span>{{ props.row.member }}</span>
                </el-form-item>
                <el-form-item label="创建时间">
                  <span>{{ props.row.createTime | time }}</span>
                </el-form-item>
                <el-form-item label="描述">
                  <span>{{ props.row.postscript }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="房间号码"
                           prop="roomNo">
          </el-table-column>
          <el-table-column label="房间名称"
                           prop="name">
          </el-table-column>
          <el-table-column label="操作"
                           prop="">
            <template slot-scope="scope">
              <el-button size="mini"
                         @click="handleEdit(scope.$index, scope.row)">查看</el-button>
              <el-button size="mini"
                         type="primary"
                         @click="addRoom(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { EVENT_ADD_ROOM, EVENT_ADD_FRIEND } from '@/service/constant'

export default {
  data() {
    return {
      currentKey: null,
      keyword: null,
      keyword2: null,
      accountList: null,
      roomList: null,
      loading: null
    }
  },

  mounted() {
    this.getAccountList()
    this.getRoomList()
  },

  methods: {
    // 账号
    getAccountList() {
      this.loading = true
      this.axios({
        url: 'friend/search',
        params: {
          keyword: this.keyword
        }
      })
        .then(res => {
          this.accountList = res
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
    },

    // 房间
    getRoomList() {
      this.loading = true
      this.axios({
        url: 'room/search',
        params: {
          keyword: this.keyword2 || ''
        }
      })
        .then(res => {
          this.roomList = res
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
    },

    rowKeyFun(event) {
      return event.id
    },

    handleEdit(index, row) {
      this.currentKey = [row.id]
    },

    //添加房间
    async addRoom(index, row) {
      await this.axios({
        url: 'room/addMember',
        method: 'post',
        _errMsg: '添加房间失败',
        data: {
          id: row.id
        }
      })
      this.myListener.emit(EVENT_ADD_ROOM);
      this.$message({
        showClose: true,
        message: '添加成功',
        type: 'success'
      });
    },

    // 添加朋友
    async addFriend(index, row) {
      await this.axios({
        url: 'friend/add',
        method: 'post',
        _errMsg: '添加好友失败',
        data: {
          uid: row.uid
        }
      })
      this.myListener.emit(EVENT_ADD_FRIEND);
      this.$message({
        showClose: true,
        message: '添加成功',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.tabs-wrap {
  width: 100%;
}

.search-input {
  max-width: 300px;
  margin-right: 20px;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>