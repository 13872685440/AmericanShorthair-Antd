<template>
  <a-spin :spinning="spinning">
    <a-card :bordered="false" class="card">
      <span slot="title">{{title}}</span>
      <a-form class="form" @submit="handleSubmit" :form="form">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 24}" :lg="{span: 24}" :md="{span: 24}" :sm="24">
            <a-form-item label="选择人员">
              <a-tree-select
                :treeData="organData"
                :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                placeholder="请选择角色关联人员"
                allowClear
                treeCheckable
                :showCheckedStrategy="SHOW_PARENT"
                treeDefaultExpandAll
                v-decorator="[
          'organ_user_data', {
            rules: [{ type: 'array' }],
          }]"
              ></a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button htmlType="submit" type="primary">保存</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-spin>
</template>

<script>
import { saveService } from "@/api/manage";
import { TreeSelect } from "ant-design-vue";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default {
  name: "Form_Organ_User",
  props: ["organData", "base", "organ_user_data"],
  data() {
    return {
      form: this.$form.createForm(this),
      title: "",
      spinning: false,
      path: {},
      SHOW_PARENT
    };
  },
  mounted() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.save_path = prefix + "/role/save_organ_user";

    this.title = "关联人员 [ " + this.base.name + " : " + this.base.des + " ]";
    this.form.setFieldsValue({ organ_user_data: this.organ_user_data });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.spinning = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          values.name = this.base.name;
          saveService(this.path.save_path, values)
            .then(res => {
              this.$notification.success({
                message: "保存成功",
                description: ""
              });
              this.$emit("changeForm", {
                name: "organ_user_data",
                data: res.result
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
      this.spinning = false;
    }
  }
};
</script>