<template>
  <div v-if="comments.length>0">
    <a-divider v-if="divider===0" />
    <a-table :columns="columns" :dataSource="comments" :pagination="false" :loading="loading"></a-table>
    <br />
  </div>
</template>
<script>
import { queryService } from "@/api/manage";

export default {
  props: {
    id: {
      type: String
    },
    ebcn: {
      type: String
    },
    divider: {
      type: Number
    }
  },
  data() {
    return {
      comments: [],
      path: {},
      loading: true,
      columns: [
        {
          title: "办理节点",
          dataIndex: "shjd",
          key: "shjd"
        },
        {
          title: "办理时间",
          dataIndex: "shtime",
          key: "shtime"
        },
        {
          title: "办理结论",
          dataIndex: "shjl",
          key: "shjl"
        },
        {
          title: "办理意见",
          dataIndex: "shyj",
          key: "shyj"
        },
        {
          title: "办理机构",
          dataIndex: "shjgName",
          key: "shjgName"
        },
        {
          title: "办理人",
          dataIndex: "shr",
          key: "shr"
        }
      ]
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.comment_path = prefix + "/task/comments";
  },
  mounted() {
    queryService(this.path.comment_path, {
      id: this.id,
      bean_ebcn: this.ebcn
    }).then(res => {
      this.comments = res.result;
      this.loading = false;
    });
  }
};
</script>