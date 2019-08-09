
<template>
  <a-spin :spinning="spinning">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false" title="任务路由" class="card">
      <a-form :form="form" class="form" @submit="handleSubmit">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 7}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="任务编码">
              <a-input
                v-if="type==='edit' && !formId"
                v-decorator="[
              'prefix', {rules: [{ required: true, message: '请输入任务编码', whitespace: true}]}
            ]"
              />
              <a-input
                v-if="type==='addlower' || formId"
                :disabled="true"
                v-decorator="[
              'superior_code'
            ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="本级节点">
              <a-input :disabled="true" v-decorator="[
              'clc'
            ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="完整编码">
              <a-input :disabled="true" v-decorator="[
              'code'
            ]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 7}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="上级节点">
              <a-input
                :disabled="true"
                v-decorator="[
              'superior_name'
            ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="节点名称">
              <a-input
                v-decorator="[
              'name', {rules: [{ required: true, message: '请输入节点名称', whitespace: true}]}
            ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="完整名称">
              <a-input :disabled="true" v-decorator="[
              'wn'
            ]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 7}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="component">
              <a-input
                v-decorator="[
              'component', {rules: [{ required: true, message: '请输入组件', whitespace: true}]}
            ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button htmlType="submit" type="primary">保存</a-button>
          <a-button style="margin-left: 8px" @click="back">返回</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-spin>
</template>
<script>
import { queryService, back_to_list, save } from "@/api/manage";

export default {
  name: "TaskRouter_Form",
  props: ["formId", "type"],
  data() {
    return {
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          this.onchange(values);
        }
      }),
      spinning: true,
      path: {}
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.edit_path = prefix + "/taskrouter/" + this.type;
    this.path.save_path = prefix + "/taskrouter/save";
  },
  mounted() {
    queryService(this.path.edit_path, { id: this.formId }).then(res => {
      this.form.setFieldsValue(res.result);
      return res.result;
    });
    this.spinning = false;
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      save(this, this.path.save_path);
    },
    back() {
      back_to_list(this);
    },
    onchange(values) {
      for (var key in values) {
        if (key === "name") {
          var superior_name = this.form.getFieldValue("superior_name");
          var wn = superior_name
            ? superior_name + "_" + values[key]
            : values[key];
          this.form.setFieldsValue({ wn: wn });
        } else if (key === "prefix") {
          var code = values[key];
          this.form.setFieldsValue({ code: code, clc: code });
        }
      }
    }
  }
};
</script>
