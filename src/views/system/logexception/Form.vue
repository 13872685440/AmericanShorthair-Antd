
<template>
  <a-spin :spinning="spinning">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false" title="异常日志" class="card">
      <a-form :form="form" class="form" @submit="handleSubmit">
        <a-form-item v-bind="formItemLayout" label="异常编码">
          <span class="ant-form-text">{{result.id}}</span>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="发生时间">
          <span class="ant-form-text">{{result.ct}}</span>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="操作用户">
          <span class="ant-form-text">{{result.username}}</span>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="服务路径">
          <span class="ant-form-text">{{result.controllermethod}}</span>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="异常消息">
          <span class="ant-form-text">{{result.message}}</span>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="堆栈信息">
          <span class="ant-form-text">{{result.stackTrace}}</span>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button style="margin-left: 8px" @click="back">返回</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-spin>
</template>
<script>
import { queryService, back_to_list} from "@/api/manage";

export default {
  name: "Apptree_Form",
  props: ["formId", "type"],
  data() {
    return {
      spinning: true,
      path: {},
      result: {}
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.edit_path = prefix + "/logexception/" + this.type;
  },
  mounted() {
    queryService(this.path.edit_path, { id: this.formId }).then(res => {
      this.result = res.result;
    });
    this.spinning = false;
  },
  methods: {
    back() {
      back_to_list(this);
    }
  }
};
</script>
