
<template>
  <a-spin :spinning="spinning">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false" title="数据字典" class="card">
      <a-form :form="form" class="form" @submit="handleSubmit">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 7}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="上级编码">
              <a-input
                :disabled="true"
                v-decorator="[
              'superior_code'
            ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="本级编码">
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
            <a-form-item label="上级字典">
              <a-input
                :disabled="true"
                v-decorator="[
              'superior_name'
            ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="字典名称">
              <a-input
                v-decorator="[
              'name', {rules: [{ required: true, message: '请输入字典名称', whitespace: true}]}
            ]"
              />
              <a-input hidden v-decorator="[
              'wn'
            ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="类型编码">
              <a-input
                v-decorator="[
              'typeCode', {rules: [{ required: true, message: '请输入类型编码', whitespace: true}]}
            ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 7}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="颜色代码">
              <a-input v-decorator="[
              'colorCode'
            ]">
                <colorPicker slot="addonAfter" v-model="color" v-on:change="headleChangeColor" />
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="排序">
              <a-input-number
                v-decorator="[
              'xh', {rules: [{ type: 'number', message: '请输入数字', whitespace: true}]}
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
import { MODEL_SYSTEM } from "@/store/mutation-types";
import colorPicker from "@/components/color-picker";

const editPath = type => {
  return "/" + MODEL_SYSTEM + "/dictionary/" + type;
};
const savePath = "/" + MODEL_SYSTEM + "/dictionary/save";

export default {
  name: "Dictionary_Form",
  props: ["formId", "type"],
  components: { colorPicker },
  data() {
    return {
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          this.onchange(values);
        }
      }),
      spinning: true,
      color: ""
    };
  },
  mounted() {
    queryService(editPath(this.type), { id: this.formId }).then(res => {
      this.form.setFieldsValue(res.result);
      return res.result;
    });
    this.spinning = false;
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      save(this, savePath);
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
        }
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    headleChangeColor(value) {
      this.form.setFieldsValue({ colorCode: value });
    }
  }
};
</script><style>
.m-colorPicker .box {
  width: 210px !important ;
  z-index: 999;
}
</style>