<template>
  <a-modal
    title="修改密码"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item v-bind="formItemLayout" label="当前用户">
          <span class="ant-form-text">{{ nickname() }}</span>
        </a-form-item>
        <a-form-item label="新密码" v-bind="formItemLayout">
          <a-input
            v-decorator="['newpwd', {rules: [{required: true, message: '请输入新密码'}]}]"
            type="password"
          />
        </a-form-item>
        <a-form-item label="新密码确认" v-bind="formItemLayout">
          <a-input
            v-decorator="['newpwd2', {rules: [{required: true, message: '请再次输入新密码'}]}]"
            type="password"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "MakePassword",
  data() {
    return {
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        }
      },
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),

      path: {}
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.save_path = prefix + "/postinformation/makepwd";
  },
  methods: {
    ...mapActions(["MakePwd"]),
    ...mapGetters(["nickname", "userId"]),
    add() {
      this.visible = true;
      this.form.resetFields();
    },
    handleCancel() {
      this.visible = false;
    },
    handleSubmit() {
      this.confirmLoading = true;
      this.form.validateFields((errors, values) => {
        if (!errors) {
          if (values.newpwd != values.newpwd2) {
            this.$message.warning("两次密码输入不一致");
            this.confirmLoading = false;
          } else {
            values.userId = this.userId();
            this.MakePwd(values)
              .then(() => {
                this.confirmLoading = false;
                this.visible = false;
                this.$notification.success({
                  message: "密码修改成功"
                });
              })
              .catch(error => {
                this.$notification.error({
                  message: "密码修改失败",
                  description: error
                });
                this.confirmLoading = false;
              });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    }
  }
};
</script>