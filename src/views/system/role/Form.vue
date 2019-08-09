<template>
  <div class="page-header-index-wide">
    <a-card
      :bordered="false"
      :bodyStyle="{ padding: '16px 0', height: '100%' }"
      :style="{ height: '100%' }"
    >
      <div class="account-settings-info-main" :class="device">
        <div class="account-settings-info-left">
          <a-menu
            :mode="device == 'mobile' ? 'horizontal' : 'inline'"
            :style="{ border: '0', width: device == 'mobile' ? '560px' : 'auto'}"
            :selectedKeys="selectedKeys"
            type="inner"
            @click="onClick"
          >
            <a-menu-item key="1">角色信息</a-menu-item>
            <a-menu-item key="2">关联菜单</a-menu-item>
            <a-menu-item key="3">关联人员</a-menu-item>
            <a-menu-item key="4">权限配置</a-menu-item>
            <a-menu-item key="0">返回列表</a-menu-item>
          </a-menu>
        </div>
        <div class="account-settings-info-right">
          <s-base v-if="key==='1'" :base="base" @changeForm="changeForm"></s-base>
          <s-apptree
            v-if="key==='2'"
            :apptreeData="apptreeData"
            :base="base"
            :app_data="app_data"
            @changeForm="changeForm"
          ></s-apptree>
          <s-organ
            v-if="key==='3'"
            :organData="organData"
            :base="base"
            :organ_user_data="organ_user_data"
            @changeForm="changeForm"
          ></s-organ>
          <s-permission
            v-if="key==='4'"
            :base="base"
            :permission_user_data="permission_user_data"
            @changeForm="changeForm"
          ></s-permission>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import SBase from "./Base";
import SApptree from "./Apptree";
import SOrgan from "./Organ";
import SPermission from "./Permission";
import { queryService, back_to_list } from "@/api/manage";
import { mixinDevice } from "@/utils/mixin.js";

export default {
  name: "Role_Form",
  props: ["formId", "apptreeData", "organData"],
  components: {
    SBase,
    SApptree,
    SOrgan,
    SPermission
  },
  mixins: [mixinDevice],
  data() {
    return {
      // horizontal  inline
      mode: "inline",

      selectedKeys: [],

      key: "",

      base: {},
      app_data: [],
      organ_user_data: [],

      permission_user_data: [],

      path: {}
    };
  },
  async created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.edit_path = prefix + "/role/edit";
    this.path.permission_user_tree_path = prefix + "/organization/filter_tree";

    this.selectedKeys = ["1"];
    await queryService(this.path.edit_path, { id: this.formId }).then(res => {
      this.base = res.result;
      this.app_data = res.result.app_data;
      this.organ_user_data = res.result.organ_user_data;

      queryService(this.path.permission_user_tree_path, {
        ids: res.result.organ_user_data,
        other: 1
      }).then(res => {
        this.permission_user_data = res.result;
      });
    });
    this.key = "1";
  },
  methods: {
    onClick(e) {
      if (e.key === "0") {
        back_to_list(this);
      } else if (e.key != "1") {
        if (!this.base.name) {
          this.$message.warning("请先保存角色");
          this.selectedKeys = ["1"];
          return;
        }
      }
      this.selectedKeys = [e.key];
      this.key = e.key;
    },
    changeForm(data) {
      if (data.name === "app_data") {
        this.app_data = data.data;
      } else if (data.name === "base") {
        this.base = data.data;
      } else if (data.name === "organ_user_data") {
        this.organ_user_data = data.data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.account-settings-info-main {
  width: 100%;
  display: flex;
  height: 100%;
  overflow: auto;

  &.mobile {
    display: block;

    .account-settings-info-left {
      border-right: unset;
      border-bottom: 1px solid #e8e8e8;
      width: 100%;
      height: 50px;
      overflow-x: auto;
      overflow-y: scroll;
    }
    .account-settings-info-right {
      padding: 20px 40px;
    }
  }

  .account-settings-info-left {
    border-right: 1px solid #e8e8e8;
    width: 224px;
  }

  .account-settings-info-right {
    flex: 1 1;
    padding: 8px 40px;

    .account-settings-info-title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      margin-bottom: 12px;
    }
    .account-settings-info-view {
      padding-top: 12px;
    }
  }
}
</style>
