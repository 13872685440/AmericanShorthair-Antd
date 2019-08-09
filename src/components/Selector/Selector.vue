<template>
  <a-modal
    :title="title"
    width="60%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    okText="确认"
    :footer="null"
  >
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="simple">
                <a-input v-model="queryParam.simple" placeholder />
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button
                  style="margin-left: 8px"
                  @click="() => {queryParam = {};$refs.table.refresh(true)}"
                >重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="code"
        :columns="columns"
        :data="loadData"
        :pageSize="5"
      ></s-table>
    </a-card>
  </a-modal>
</template>
<script>
import { STable } from "@/components";
import { queryList } from "@/utils/mixin";
import { queryService } from "@/api/manage";

export default {
  mixins: [queryList],
  components: { STable },
  props: {
    query_path: {
      type: String,
      default: "/common/selector"
    }
  },
  data() {
    return {
      columns: [
        {
          title: "角色名",
          dataIndex: "name",
          sorter: true
        },
        {
          title: "描述",
          dataIndex: "des"
        }
      ],
      visible: false,
      confirmLoading: false,
      title: "",
      loadData: parameter => {
        parameter.params = this.queryParam;
        return queryService(this.path.query_path, parameter).then(res => {
          return res.result;
        });
      }
    };
  },
  created: function() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.query_path = prefix + this.query_path;
  },
  methods: {
    add(title, service) {
      this.title = title;
      this.visible = true;
      this.service = service;
    },
    handleCancel() {
      this.visible = false;
    }
  }
};
</script>