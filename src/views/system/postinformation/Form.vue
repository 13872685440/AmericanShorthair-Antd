<template>
  <a-spin :spinning="spinning">
    <a-card :bordered="false" title="人员管理" class="card">
      <a-form :form="form" class="form" @submit="handleSubmit">
        <a-form-item
          label="所在部门"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
            :readOnly="true"
            v-decorator="[
            'organ_name',{rules: [{ required: true, message: '请输入所在部门', whitespace: true}]}
          ]"
          />
          <a-input hidden v-decorator="[
            'organ_id'
          ]" />
          <a-input hidden v-decorator="[
            'id'
          ]" />
        </a-form-item>
        <a-form-item
          label="姓名"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 5}, sm: {span: 12} }"
        >
          <a-input
            v-decorator="[
            'person_name',{rules: [{ required: true, message: '请输入姓名', whitespace: true}]}
          ]"
          />
          <a-input hidden v-decorator="[
            'person_id'
          ]" />
        </a-form-item>
        <a-form-item
          label="手机号码"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 5}, sm: {span: 12} }"
        >
          <a-input
            v-decorator="[
            'phone',{rules: [{ required: true, message: '请输入手机号码', whitespace: true}]}
          ]"
          />
        </a-form-item>
        <a-form-item
          v-if="formId!=''"
          label="重置密码"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 5}, sm: {span: 12} }"
        >
          <a-input :disabled="true" v-decorator="[
            'pwd'
          ]">
            <a-icon
              slot="addonAfter"
              type="reload"
              style="color:red;cursor:pointer"
              @click="reset()"
            />
          </a-input>
        </a-form-item>
        <a-form-item
          label="职务"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 5}, sm: {span: 12} }"
        >
          <a-input v-decorator="[
            'duty'
          ]" />
        </a-form-item>
        <a-form-item
          label="序号"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input-number
            v-decorator="[
            'xh', {rules: [{ type: 'number', message: '请输入数字', whitespace: true}]}
          ]"
          />
        </a-form-item>
        <a-form-item
          label="任职状态"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-radio-group
            v-decorator="['leaf_code', {rules: [{ required: true, message: '请选择任职状态', whitespace: true}]}]"
          >
            <template v-for="type in POSTTYPE">
              <a-radio :key="type.code" :value="type.code">{{type.name}}</a-radio>
            </template>
          </a-radio-group>
        </a-form-item>

        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button htmlType="submit" type="primary">保存</a-button>
          <a-button style="margin-left: 8px" @click="back">返回</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card :bordered="false" title="任职经历" class="card">
      <a-table :columns="columns" :dataSource="data" :pagination="false" :loading="memberLoading"></a-table>
    </a-card>
  </a-spin>
</template>
<script>
import { queryService, toService, back_to_list, save } from "@/api/manage";
import { MODEL_SYSTEM } from "@/store/mutation-types";

const editPath = type => {
  return "/" + MODEL_SYSTEM + "/postinformation/" + type;
};
const savePath = "/" + MODEL_SYSTEM + "/postinformation/save";
const getPostPath = "/" + MODEL_SYSTEM + "/postinformation/get";
const resetPath = "/" + MODEL_SYSTEM + "/postinformation/reset";

export default {
  name: "Dictionary_Form",
  props: ["formId", "type", "POSTTYPE"],
  data() {
    return {
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          this.onchange(values);
        }
      }),
      spinning: true,

      // table
      columns: [
        {
          title: "部门",
          dataIndex: "organ_name",
          key: "organ_name",
          width: "50%"
        },
        {
          title: "职务",
          dataIndex: "duty",
          key: "duty",
          width: "30%"
        },
        {
          title: "任职状态",
          dataIndex: "leaf_data",
          key: "leaf_data",
          width: "20%"
        }
      ],
      memberLoading: false,
      data: []
    };
  },
  mounted() {
    queryService(editPath(this.type), { id: this.formId }).then(res => {
      this.form.setFieldsValue(res.result);
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
        if (key === "phone") {
          this.memberLoading = true;
          queryService(getPostPath, {
            id: this.formId,
            phone: values[key]
          }).then(res => {
            if (res.result) {
              this.data = res.result.posts;
              this.form.setFieldsValue({
                person_name: res.result.userbean.name,
                person_id: res.result.userbean.id
              });
            }
            this.memberLoading = false;
          });
        }
      }
    },
    reset() {
      const parameter = {
        id: this.formId
      };
      let that = this;
      this.$confirm({
        title: "提示",
        content: "真的要重置密码吗 ?",
        onOk() {
          toService("post", resetPath, parameter).then(res => {
            that.form.setFieldsValue({
              pwd: res.result
            });
            this.$notification.success({
              message: "密码重置成功",
              description: "密码重置成功"
            });
          });
        },
        onCancel() {}
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