<template>
  <a-spin :spinning="spinning">
    <a-card :bordered="false" title="角色信息" class="card">
      <a-form :form="form" class="form" @submit="handleSubmit">
        <a-form-item
          label="角色名"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
            :readOnly="name_readonly"
            v-decorator="[
            'name',{rules: [{ required: true, message: '请输入角色名', whitespace: true}]}
          ]"
          />
        </a-form-item>
        <a-form-item
          label="描述"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 5}, sm: {span: 12} }"
        >
          <a-input
            v-decorator="[
            'des',{rules: [{ required: true, message: '请输入描述', whitespace: true}]}
          ]"
          />
        </a-form-item>

        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button htmlType="submit" type="primary">保存</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-spin>
</template>
<script>
import { saveService } from "@/api/manage";

export default {
  name: "Form_Base",
  props: ["base"],
  data() {
    return {
      form: this.$form.createForm(this),
      spinning: true,
      name_readonly: false,
      path: {}
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.edit_path = prefix + "/role/save";
  },
  mounted() {
    if (this.base.name) {
      this.name_readonly = true;
    }
    this.form.setFieldsValue(this.base);
    this.spinning = false;
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.spinning = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          saveService(this.path.edit_path, values)
            .then(() => {
              this.$notification.success({
                message: "保存成功",
                description: ""
              });
              this.$emit("changeForm", {
                name: "base",
                data: values
              });
              this.spinning = false;
            })
            .catch(error => {
              this.spinning = false;
              console.log(error);
            });
        } else {
          this.spinning = false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
</style>