
<template>
  <a-spin :spinning="spinning">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false" title="菜单应用" class="card">
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
            <a-form-item label="上级菜单">
              <a-input
                :disabled="true"
                v-decorator="[
              'superior_name'
            ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="菜单名称">
              <a-input
                v-decorator="[
              'name', {rules: [{ required: true, message: '请输入菜单名称', whitespace: true}]}
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
            <a-form-item label="path">
              <a-input v-decorator="[
              'path'
            ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="component">
              <a-input
                v-decorator="[
              'component', {rules: [{ required: true, message: '请输入组件', whitespace: true}]}
            ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="排序">
              <a-input v-decorator="[
              'xh'
            ]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 7}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item label="icon">
              <a-select
                showSearch
                placeholder="选择一个icon"
                optionFilterProp="children"
                style="width: 200px"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
                :filterOption="filterOption"
                v-decorator="[
          'icon'
        ]"
              >
                <a-select-option v-for="d in icons" :key="d">
                  {{d}}
                  <a-icon :type="d" />
                </a-select-option>
              </a-select>
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
import icons from "@/components/Icons/icons";

export default {
  name: "Apptree_Form",
  props: ["formId", "type"],
  data() {
    return {
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          this.onchange(values);
        }
      }),
      icon: "",
      icons: icons,
      spinning: true,
      path: {}
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.edit_path = prefix + "/apptree/" + this.type;
    this.path.save_path = prefix + "/apptree/save";
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
    handleChange(value) {
      this.icon = value;
    }
  }
};
</script>
