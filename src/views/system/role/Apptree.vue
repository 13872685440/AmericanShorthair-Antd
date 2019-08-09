<template>
  <a-spin :spinning="spinning">
    <a-card :bordered="false" class="card">
      <span slot="title">{{title}}</span>
      <a-form class="form" @submit="handleSubmit" :form="form">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 24}" :lg="{span: 24}" :md="{span: 24}" :sm="24">
            <a-form-item label="选择菜单">
              <a-tree-select
                :treeData="apptreeData"
                :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                placeholder="请选择角色关联菜单"
                allowClear
                multiple
                treeDefaultExpandAll
                v-decorator="[
          'app_data', {
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
export default {
  name: "Form_Apptree",
  props: ["apptreeData", "base", "app_data"],
  data() {
    return {
      form: this.$form.createForm(this),
      title: "",
      spinning: false,
      path: {}
    };
  },
  mounted() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.save_path = prefix + "/role/save_app";

    this.title = "关联菜单 [ " + this.base.name + " : " + this.base.des + " ]";
    this.form.setFieldsValue({ app_data: this.app_data });
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
                name: "app_data",
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