<template>
  <s-entity :formId="formId" :path="path" :readOnly="readOnly" @edit="edit" ref="sentity">
    <span slot="form_button">
      <template v-if="type==='edit'">
        <a-button @click="handleSubmitTJ" type="primary">提交</a-button>
        <a-button style="margin-left: 8px" @click="handleSubmit" type="primary">保存</a-button>
      </template>
      <a-button style="margin-left: 8px" @click="edit">返回</a-button>
    </span>
  </s-entity>
</template>
<script>
import { editForm } from "@/utils/mixin";
import SEntity from "./Entity";

export default {
  name: "Test2_Form",
  props: ["formId", "type"],
  components: {
    SEntity
  },
  mixins: [editForm],
  data() {
    return {
      readOnly: false
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.edit_path = prefix + "/test2/edit";
    this.path.save_path = prefix + "/test2/save";
    this.path.submit_path = prefix + "/test2/submit";

    if (this.type === "edit") {
      this.readOnly = false;
    } else {
      this.readOnly = true;
    }
  },
  methods: {
    edit() {
      this.back();
    },
    handleSubmit(e) {
      this.$refs.sentity.handleSubmit(e);
    },
    handleSubmitTJ(e) {
      let data = {
        role: "SYS_ADMINISTRATOR",
        nodeName: "审批",
        shjd: "开始",
        shjl: "申请",
        shyj: "提交申请",
        step: 1,
        ystep: 0,
        view: "TEST20001"
      };
      console.log("data", data);
      this.$refs.sentity.handleSubmitProcess(e, data);
    }
  }
};
</script>
