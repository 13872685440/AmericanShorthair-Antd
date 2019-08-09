<template>
  <div>
    <s-entity
      :formId="formId"
      :taskId="taskId"
      :path="path"
      :readOnly="readOnly"
      @edit="edit"
      ref="sentity"
    >
      <span slot="process_button">
        <a-button style="margin-left: 8px" @click="edit">返回</a-button>
        <a-button style="margin-left: 8px" @click="handleSubmitCxtj" type="primary">重新提交</a-button>
      </span>
    </s-entity>
  </div>
</template>
<script>
import { editForm } from "@/utils/mixin";
import SEntity from "../Entity";

export default {
  name: "Task_Form",
  components: {
    SEntity
  },
  mixins: [editForm],
  data() {
    return {
      readOnly: false,
      formId: "",
      taskId: "",
      task_crtUid: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.formId = to.params.keyValue;
      vm.taskId = to.params.id;
      vm.task_crtUid = to.params.task_crtUid;
    });
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.edit_path = prefix + "/test3/edit";
    this.path.save_path = prefix + "/test3/save";
    this.path.submit_path = prefix + "/process/next";
  },
  methods: {
    edit() {
      this.toHome();
    },
    handleSubmitCxtj(e) {
      let data = {
        usermaps: {
          role: "SYS_ADMINISTRATOR",
          node: "初审"
        },
        shjl: "重新提交",
        shyj: "提交申请",
        task_id: this.taskId,
        step: 1,
        processName: "测试流程3",
        service: "Test_Sq_Service"
      };
      this.$refs.sentity.handleSubmitProcess_save(e, data);
    }
  }
};
</script>
