
<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="描述">
              <a-input v-model="queryParam.des" placeholder />
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
    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        v-action:SYS_ADMINISTRATOR
        @click="handleEdit('','add')"
      >新建</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="code"
      :columns="columns"
      :data="loadData"
      :pageSize="20"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record.name,'add')" title="编辑">
            <a-icon type="edit" style="color:#69aa46" />
          </a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record.name)">
            <a-icon type="delete" style="color:#FF6347" title="删除" />
          </a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>
<script>
import { STable } from "@/components";
import { queryService, handle_delete } from "@/api/manage";
import { queryList } from "@/utils/mixin";

export default {
  name: "TableList",
  components: { STable },
  mixins: [queryList],
  data() {
    return {
      // 表头
      columns: [
        {
          title: "角色名",
          dataIndex: "name",
          sorter: true
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
      // 加载数据方法 必须为 Promise 对象
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
    this.path.query_path = prefix + this.$route.path;
    this.path.delete_path = prefix + "/role/delete";
  },
  methods: {
    handleDelete(id) {
      handle_delete(this, id, this.path.delete_path);
    }
  }
};
</script>