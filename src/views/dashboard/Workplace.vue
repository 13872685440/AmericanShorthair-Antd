<template>
  <div>
    <page-view :avatar="avatar" :title="false">
      <div slot="headerContent">
        <div class="title">
          {{ timeFix }}，{{ user.name }}
          <span class="welcome-text"></span>
        </div>
        <template v-for="post in user.posts">
          <span :key="post.organ_id" style="padding-right:15px;">
            <span>{{post.organ_name}}</span>
            <span v-if="post.duty">
              <a-divider type="vertical" />
              {{post.duty}}
            </span>
            <span>
              <a-divider type="vertical" />
              {{post.leaf_data}}
            </span>
          </span>
        </template>
      </div>
      <div class="_content">
        <a-row :gutter="24">
          <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
            <a-card :loading="loading" :bordered="false">
              <span slot="title">
                <span>待办任务</span>
                <a-badge :count="task_totalCount">
                  <span>&#160;&#160;&#160;&#160;</span>
                </a-badge>
              </span>
              <a-list
                itemLayout="vertical"
                size="small"
                :pagination="pagination"
                :dataSource="task_data"
                ref="_task"
              >
                <a-list-item slot="renderItem" slot-scope="item" key="item.id">
                  <template slot="actions">
                    <span>
                      <span
                        v-if="item.taskType==='待领取'"
                        style="color: #69aa46"
                        @click="receiveTask(item,1)"
                      >
                        领取任务
                        <a-divider type="vertical" />
                      </span>
                      <span
                        v-if="item.taskType==='已领取'"
                        style="color: #ff892a"
                        @click="receiveTask(item,2)"
                      >
                        取消领取
                        <a-divider type="vertical" />
                      </span>
                      <span v-if="item.taskType==='待办' || item.taskType==='已领取'">
                        <router-link
                          :to="{ name: item.view ,params: { id:item.id,keyValue:item.keyValue,task_crtUid:item.crtUid }}"
                        >处理任务</router-link>
                        <a-divider type="vertical" />
                      </span>
                      <span v-if="item.taskId">
                        <a
                          @click="$refs.simage.add({processInstanceId:item.processInstanceId})"
                          title="查看流程图"
                          style="color: #a069c3"
                        >查看流程图</a>
                      </span>
                    </span>
                  </template>
                  <a-list-item-meta>
                    <span slot="title">{{item.taskName}}</span>
                    <span slot="description">
                      <span>
                        任务节点：{{item.nodeName}}
                        <a-divider type="vertical" />
                        发起人：{{item.firsttransactor}}
                        <a-divider type="vertical" />
                        上一步办理人：{{item.previoustransactor}}
                        <a-divider type="vertical" />
                        上一步办理时间：{{item.ct}}
                      </span>
                    </span>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-card>
          </a-col>
          <a-col :xl="8" :lg="16" :md="16" :sm="16" :xs="16">
            <a-card :loading="loading" :bordered="false">
              <span slot="title">
                <span>动态</span>
                <a-badge :count="task_totalCount">
                  <span>&#160;&#160;&#160;&#160;</span>
                </a-badge>
              </span>
              <a-list
                itemLayout="vertical"
                size="small"
                :pagination="pagination"
                :dataSource="task_data"
                ref="_task"
              ></a-list>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <s-image ref="simage" :path="path.image_path" title="查看流程图" />
    </page-view>
    <setting-drawer v-if="isDesktop()"></setting-drawer>
  </div>
</template>
<script>
import { timeFix } from "@/utils/util";
import { mixin, mixinDevice } from "@/utils/mixin";
import { PageView } from "@/layouts";
import { queryService, toService } from "@/api/manage";
import SImage from "@/components/Image/Image";
import SettingDrawer from "@/components/SettingDrawer";

export default {
  name: "Workplace",
  mixins: [mixin, mixinDevice],
  components: {
    PageView,
    SImage,
    SettingDrawer
  },
  data() {
    return {
      timeFix: timeFix(),
      avatar: "",
      user: {},
      loading: true,
      path: {},
      task_data: [],
      task_totalCount: 0,
      pagination: {
        onChange: page => {
          console.log(page);
        },
        pageSize: 5
      }
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    }
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.user = this.userInfo;
    this.avatar = this.userInfo.avatar;
    this.path.task_path = prefix + "/taskext/main";
    this.path.receive_path = prefix + "/taskext/receive";
    this.path.cancelreceive_path = prefix + "/taskext/cancelreceive";
    this.path.image_path = prefix + "/processdefinitionbean/viewimage_now";
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.iniTask();
    });
  },
  methods: {
    async receiveTask(item, i) {
      const data = { id: item.id };
      if (i == 1) {
        await toService("POST", this.path.receive_path, data).then(res => {
          if (res.code === "400") {
            this.$notification.error({
              message: "任务领取失败",
              description: "任务已被领取"
            });
          } else if (res.code === "200") {
            this.$notification.success({
              message: "任务领取成功"
            });
            this.iniTask();
          }
        });
      } else {
        await toService("POST", this.path.cancelreceive_path, data).then(
          res => {
            if (res.code === "200") {
              this.$notification.success({
                message: "取消领取成功"
              });
              this.iniTask();
            }
          }
        );
      }
    },
    iniTask() {
      queryService(this.path.task_path, { pageSize: -1 }).then(res => {
        this.task_data = res.result.data;
        this.task_totalCount = res.result.totalCount;
        if (res.result.totalCount <= 5) {
          this.pagination = false;
        }
        this.loading = false;
      });
    }
  }
};
</script>
<style lang="less" scoped>
._content {
  margin: 10px 10px !important;
}
</style>

