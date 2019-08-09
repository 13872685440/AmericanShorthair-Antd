<template>
  <div>
    <a-spin :spinning="spinning">
      <s-list v-if="currentTab === 'list'" @edit="edit" />
      <s-form
        v-if="currentTab === 'add'"
        :formId="id"
        :type="type"
        :apptreeData="apptreeData"
        :organData="organData"
        @edit="edit"
      />
    </a-spin>
  </div>
</template>

<script>
import SList from "./List";
import SForm from "./Form";
import { queryService } from "@/api/manage";
import axios from "axios";

export default {
  name: "Main_Role",
  components: {
    SList,
    SForm
  },
  data() {
    return {
      currentTab: "list",
      id: "",
      type: "",
      apptreeData: [],
      organData: [],
      spinning: false,
      path: {}
    };
  },
  created() {
    this.spinning = true;
    this.path.apptree_path =
      "/" + this.GLOBAL.MODEL_SYSTEM + "/dictionary/tree";
    this.path.organ_path =
      "/" + this.GLOBAL.MODEL_SYSTEM + "/organization/tree";
    const that = this;
    axios
      .all([
        queryService(this.path.apptree_path, {
          table_name: "sys_app_tree",
          other: 1
        }),
        queryService(this.path.organ_path, {
          other: 1
        })
      ])
      .then(
        axios.spread(function(acct, perms) {
          that.apptreeData = acct.result;
          that.organData = perms.result;
          that.spinning = false;
        })
      );
  },
  methods: {
    edit(data) {
      this.currentTab = data.state;
      this.id = data.id;
      this.type = data.type;
    }
  }
};
</script>
