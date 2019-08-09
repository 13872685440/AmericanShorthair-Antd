<template>
  <a-spin :spinning="spinning">
    <a-form :form="form" class="ant-advanced-search-form">
      <a-card :body-style="{padding: '24px 32px'}" :bordered="false" class="card">
        <span slot="title">测试Demo</span>
        <span slot="extra">
          <a @click="toggleAdvanced" slot="extra" style="color: #a069c3">{{advanced ? '关闭' : '展开' }}</a>
          <slot name="process_button"></slot>
        </span>
        <template v-if="advanced">
          <s-comment :id="formId" :ebcn="common_data.bean_ebcn" :divider="1"></s-comment>
        </template>

        <a-row :gutter="50">
          <a-col :span="10">
            <a-form-item label="simple">
              <a-input
                :readOnly="readOnly"
                v-decorator="[
              'simple',  {rules: [{ required: true, message: '请输入', whitespace: true}]}
            ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="id">
              <a-input :readOnly="true" v-decorator="[
              'id'
            ]" />
              <a-input hidden v-decorator="[
              'processDefinition'
            ]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <slot name="form_button"></slot>
        </a-form-item>
      </a-card>
    </a-form>
  </a-spin>
</template>
<script>
import {
  save,
  submit,
  submit_msg,
  submit_save,
  submit_save_msg,
  queryService
} from "@/api/manage";
import SComment from "@/components/Comment/SComment";
const ebcn = "com.cat.activiti.model.Test3";

export default {
  components: {
    SComment
  },
  props: {
    formId: { type: String },
    path: { type: Object },
    taskId: { type: String },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      step: 0,
      spinning: true,
      common_data: {
        taskName: "测试流程3",
        bean_ebcn: ebcn,
        shjgName:
          this.$store.getters.userInfo.posts.length > 0
            ? this.$store.getters.userInfo.posts[0].organ_name
            : "",
        userName: this.$store.getters.userInfo.name
      },
      advanced: false
    };
  },
  mounted() {
    this.iniData();
  },
  watch: {
    taskId() {
      this.spinning = true;
      this.advanced = false;
      this.iniData();
    }
  },
  methods: {
    iniData() {
      queryService(this.path.edit_path, { id: this.formId }).then(res => {
        this.form.setFieldsValue(res.result);
        this.step = res.result.step;
        this.spinning = false;
      });
    },
    iniParam(data) {
      for (var p in this.common_data) {
        data[p] = this.common_data[p];
      }
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleSubmit(e) {
      e.preventDefault();
      save(this, this.path.save_path);
    },
    handleSubmitProcess(e, data) {
      e.preventDefault();
      this.iniParam(data);
      submit(this, this.path.submit_path, data);
    },
    handleSubmitProcess_save(e, data) {
      e.preventDefault();
      this.iniParam(data);
      submit_save(this, this.path.save_path, this.path.submit_path, data);
    },
    handleSubmitProcess_msg(data) {
      this.iniParam(data);
      submit_msg(this, this.path.submit_path, data);
    },
    handleSubmitProcess_save_msg(data) {
      this.iniParam(data);
      submit_save_msg(this, this.path.save_path, this.path.submit_path, data);
    },
    back() {
      this.$emit("edit");
    }
  }
};
</script>
<style>
.ant-advanced-search-form {
  padding: 24px;
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}
</style>