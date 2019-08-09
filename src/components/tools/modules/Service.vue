<template>
  <a-modal title="技术支持" :width="600" :visible="visible" @cancel="handleCancel" :footer="null">
    <a-spin :spinning="false">
      <a-form-item v-bind="formItemLayout" label="开发单位">
        <span class="ant-form-text">宜昌协同信安网络应用有限公司</span>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="技术支持QQ群">
        <span class="ant-form-text">xxxxxxxxxxxxxx</span>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="技术支持QQ">
        <span class="ant-form-text">xxxxxxxxxxxxxx</span>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="服务时间">
        <span class="ant-form-text">工作日（8:30-12：00，14:00-17:30）</span>
      </a-form-item>
    </a-spin>
  </a-modal>
</template>

<script>

export default {
  name: "Service",
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
      visible: false
    };
  },
  methods: {
    add() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    }
  }
};
</script>