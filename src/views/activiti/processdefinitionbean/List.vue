
<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-upload
        :action="path.deploy_path"
        :showUploadList="false"
        :headers="headers"
        @change="handleChange"
      >
        <a-button icon="upload" v-action:SYS_ADMINISTRATOR>部署</a-button>
      </a-upload>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :pageSize="20"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a
            @click="$refs.simage.add({ deploymentId: record.deploymentId,
        diagramResourceName: record.diagramResourceName})"
            title="查看流程图"
          >
            <a-icon type="eye" style="color:#a069c3" />
          </a>
        </template>
      </span>
      <span slot="jds" slot-scope="text, record">
        <template v-for="jd in record.jds">
          <div :key="jd">{{jd}}</div>
        </template>
      </span>
    </s-table>
    <s-image ref="simage" :path="path.image_path" :title="查看流程图" />
  </a-card>
</template>
<script>
import Vue from "vue";
import { STable } from "@/components";
import { queryService } from "@/api/manage";
import { queryList } from "@/utils/mixin";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import SImage from "@/components/Image/Image";

export default {
  name: "TableList",
  components: { STable, SImage },
  mixins: [queryList],
  data() {
    return {
      // 表头
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          sorter: true
        },
        {
          title: "名称",
          dataIndex: "name"
        },
        {
          title: "流程定义的key",
          dataIndex: "key"
        },
        {
          title: "版本",
          dataIndex: "version"
        },
        {
          title: "部署ID",
          dataIndex: "deploymentId"
        },
        {
          title: "流程节点",
          dataIndex: "jds",
          scopedSlots: { customRender: "jds" }
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "150px",
          scopedSlots: { customRender: "action" }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        parameter.params = this.queryParam;
        return queryService(this.path.query_path, parameter).then(res => {
          return res.result;
        });
      },
      headers: {},
      pic: ""
    };
  },
  created: function() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.query_path = prefix + this.$route.path;
    this.path.deploy_path = "/api" + prefix + "/processdefinitionbean/deploy";
    this.path.image_path = prefix + "/processdefinitionbean/viewimage";
    const token = Vue.ls.get(ACCESS_TOKEN);
    if (token) {
      this.headers["ACCESS-TOKEN"] = token;
    }
  },
  methods: {
    handleChange(info) {
      if (info.file.status === "error") {
        this.$notification.error({
          message: "错误",
          description: "流程部署失败"
        });
      } else {
        if (info.file.status === "done") {
          if (info.file.response.status === "sucess") {
            this.$notification.success({
              message: "流程部署成功"
            });
            this.$refs.table.refresh(true);
          } else {
            this.$notification.error({
              message: "错误",
              description: "流程部署失败"
            });
          }
        }
      }
    }
  }
};
</script>