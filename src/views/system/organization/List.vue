<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <s-tree
          :dataSource="tree"
          :search="true"
          :expandedKeys.sync="expandedKeys"
          :selectedKeys.sync="selectedKeys"
          :autoExpandParent="autoExpandParent"
          :defaultExpandedKeys="defaultExpandedKeys"
          :searchValue="searchValue"
          @expand="onExpand"
          @select="select"
          @change="onChange"
          ref="tree"
        ></s-tree>
      </a-col>
      <a-col :span="19">
        <div class="table-operator">
          <a-button
            type="primary"
            icon="plus"
            v-action:SYS_ADMINISTRATOR
            @click="handleEdit('','add')"
          >新建</a-button>
        </div>
        <s-table ref="table" size="default" :columns="columns" :data="loadData" :pageSize="20">
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleLower(record.code,'add')" title="添加下级">
                <a-icon type="plus-circle" style="color:#478fca" />
              </a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record.code,'add')" title="编辑">
                <a-icon type="edit" style="color:#69aa46" />
              </a>
              <a-divider type="vertical" />
              <a @click="handleDelete(record.code)" title="删除">
                <a-icon type="delete" style="color:#FF6347" />
              </a>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
import STree from "@/components/Tree/STree";
import { STable } from "@/components";
import { queryService, handle_delete } from "@/api/manage";
import { queryList, treeList, generateList } from "@/utils/mixin";

export default {
  name: "TreeList",
  props: ["searchCode"],
  components: {
    STable,
    STree
  },
  mixins: [queryList, treeList],
  data() {
    return {
      // 表头
      columns: [
        {
          title: "编码",
          dataIndex: "code",
          sorter: true
        },
        {
          title: "名称",
          dataIndex: "name"
        },
        {
          title: "上级",
          dataIndex: "superior_name"
        },
        {
          title: "排序",
          dataIndex: "xh",
          sorter: true
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
        this.handleIniTree();
        this.queryParam.code = this.code;
        parameter.params = this.queryParam;
        return queryService(this.path.query_path, parameter).then(res => {
          return res.result;
        });
      },
      code: ""
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.query_path = prefix + this.$route.path;
    this.path.delete_path = prefix + "/organization/delete";
    this.path.tree_path = prefix + "/organization/tree";
  },
  methods: {
    handleDelete(id) {
      handle_delete(this, id, this.path.delete_path);
    },
    handleIniTree() {
      if (this.code === "") {
        this.code = this.searchCode;
      }
      queryService(this.path.tree_path, {}).then(res => {
        this.tree = res.result;
        this.expandedKeys.push(this.code);
        this.selectedKeys.push(this.code);
        generateList(res.result, this.dataList);
      });
    },
    select(key) {
      this.$emit("search", key[0]);
      this.code = key[0];
      this.selectedKeys = key;
      this.$refs.table.refresh(true);
    }
  }
};
</script>
<style lang="less" scoped>
.ant-tree-node-content-wrapper {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
}
</style>

