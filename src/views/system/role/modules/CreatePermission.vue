<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="权限名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入权限名'}]}]" />
        </a-form-item>
        <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['des', {rules: [{required: true, message: '请输入描述'}]}]" />
        </a-form-item>
        <a-form-item label="选择权限关联人员" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-tree-select
            :treeData="permission_user_data"
            :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
            placeholder="选择权限关联人员"
            allowClear
            multiple
            treeDefaultExpandAll
            v-decorator="[
          'user_data', {
            rules: [{ type: 'array' }],
          }]"
          ></a-tree-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { queryService, saveService } from "@/api/manage";

export default {
  props: ["base", "permission_user_data"],
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),

      path: {},
      title: ""
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.edit_path = prefix + "/permission/edit";
    this.path.save_path = prefix + "/permission/save";
    this.title = "添加权限[" + this.base.name + "]";
  },
  methods: {
    add(id) {
      this.visible = true;
      if (id) {
        this.confirmLoading = true;
        queryService(this.path.edit_path, { id: id }).then(res => {
          this.form.setFieldsValue(res.result);
          this.confirmLoading = false;
        });
      } else {
        this.form.resetFields();
      }
    },
    handleSubmit() {
      const that = this;
      this.confirmLoading = true;
      this.form.validateFields((errors, values) => {
        if (!errors) {
          values.roleName = this.base.name;
          saveService(this.path.save_path, values)
            .then(() => {
              that.$notification.success({
                message: "保存成功",
                description: ""
              });
              that.$emit("ok");
              that.visible = false;
              that.confirmLoading = false;
            })
            .catch(error => {
              that.confirmLoading = false;
              console.log(error);
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
    }
  }
};
</script>
