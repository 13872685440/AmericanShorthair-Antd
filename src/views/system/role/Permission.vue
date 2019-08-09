<template>
  <a-spin :spinning="spinning">
    <a-card :bordered="false" class="card">
      <span slot="title">权限配置</span>
      <a-button
        type="primary"
        icon="plus"
        v-action:SYS_ADMINISTRATOR
        @click="$refs.createPermission.add('')"
      >新建</a-button>
      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :loading="spinning"
        ref="table"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a-divider type="vertical" />
            <a @click="$refs.createPermission.add(record.name)">
              <a-icon type="edit" style="color:#69aa46" />
            </a>
            <a-divider type="vertical" />
            <a @click="handleDelete(record.name)">
              <a-icon type="delete" style="color:#FF6347" />
            </a>
          </template>
        </span>
      </a-table>
      <create-permission
        ref="createPermission"
        :base="base"
        :permission_user_data="permission_user_data"
        @ok="handleOk"
      />
    </a-card>
  </a-spin>
</template>
<script>
import CreatePermission from "./modules/CreatePermission";
import { queryService, toService } from "@/api/manage";

export default {
  name: "Form_Base",
  props: ["base", "permission_user_data"],
  components: {
    CreatePermission
  },
  data() {
    return {
      spinning: true,
      columns: [
        {
          title: "权限名",
          dataIndex: "name"
        },
        {
          title: "描述",
          dataIndex: "des"
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "150px",
          scopedSlots: { customRender: "action" }
        }
      ],
      data: [],
      path: {}
    };
  },
  mounted() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.query_path = prefix + "/role/query_permission";
    this.path.delete_path = prefix + "/role/delete_permission";

    this.renderTable();
    this.spinning = false;
  },
  methods: {
    handleOk() {
      this.renderTable();
    },
    async renderTable() {
      await queryService(this.path.query_path, {
        roleName: this.base.name
      }).then(res => {
        this.data = res.result;
      });
    },
    handleDelete(name) {
      this.spinning = true;
      const that = this;
      const parameter = { id: name };
      this.$confirm({
        title: "提示",
        content: "真的要删除该记录吗 ?",
        onOk() {
          toService("post", that.path.delete_path, parameter).then(res => {
            if (res.code === "200") {
              that.$notification.success({
                message: "删除成功",
                description: ""
              });
              that.renderTable();
            }
          });
        },
        onCancel() {}
      });
      this.spinning = false;
    }
  }
};
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
.ant-table-wrapper {
  padding-top: 10px;
}
</style>