<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    okText="提交"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="审批意见">
          <a-textarea
            v-decorator="['shyj', {rules: [{required: true, message: '审批意见'}]}]"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),
      title: "",
      service: ""
    };
  },
  methods: {
    add(title, service) {
      this.title = title;
      this.visible = true;
      this.service = service;
    },
    handleCancel() {
      this.visible = false;
    },
    handleSubmit() {
      const that = this;
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$confirm({
            title: "提示",
            content: "确认提交吗 ?",
            onOk() {
              that.$emit(that.service, { shyj: values.shyj });
              that.visible = false;
              that.confirmLoading = false;
            },
            onCancel() {
              that.confirmLoading = false;
            }
          });
        } else {
          this.confirmLoading = false;
        }
      });
    }
  }
};
</script>