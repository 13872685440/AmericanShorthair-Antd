
<template>
  <a-spin :spinning="spinning">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false" title="测试表单" class="card">
      <a-form :form="form" class="ant-advanced-search-form" @submit="handleSubmit">
        <a-row :gutter="50">
          <a-col :span="10">
            <a-form-item v-bind="formItemLayout" label="simple">
              <a-input
                v-decorator="[
              'simple',  {rules: [{ required: true, message: '请输入', whitespace: true}]}
            ]"
              />
              <a-input hidden v-decorator="[
              'id'
            ]" />
              <a-input hidden v-decorator="[
              'tmpId'
            ]" />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item v-bind="formItemLayout" label="simple2">
              <a-input :readOnly="true" v-decorator="[
              'simple2'
            ]"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="50">
          <a-col :span="10">
            <a-form-item v-bind="formItemLayout" label="上传文件">
              <upload-file :multiple="true" :file_data="file_data"></upload-file>

              <a-button @click="handlePrint">
                <a-icon type="printer" />打印
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="50">
          <a-col :span="10">
            <a-form-item v-bind="formItemLayout" label="上传文件2">
              <upload-file :multiple="true" :file_data="file_data2"></upload-file>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button htmlType="submit" type="primary">保存</a-button>
          <a-button style="margin-left: 8px" @click="back">返回</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <s-selector ref="selector"></s-selector>
  </a-spin>
</template>
<script>
import { queryService, save, download } from "@/api/manage";
import { editForm } from "@/utils/mixin";
import UploadFile from "@/components/File/UploadFile";
import SSelector from "@/components/Selector/Selector";

export default {
  name: "Test4_Form",
  props: ["formId", "type"],
  mixins: [editForm],
  components: {
    UploadFile,
    SSelector
  },
  data() {
    return {
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          this.onchange(values);
        }
      }),
      formItemLayout: {
        labelCol: { span: 6 }
      },
      file_data: {
        ebcn: "com.cat.activiti.model.Test4",
        sign: "A1"
      },
      file_data2: {
        ebcn: "com.cat.activiti.model.Test4",
        sign: "A2"
      }
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.edit_path = prefix + "/test4/" + this.type;
    this.path.save_path = prefix + "/test4/save";

    this.path.print_path = prefix + "/file/printFile";

    if (this.formId) {
      this.file_data.keyValue = this.formId;
      this.file_data2.keyValue = this.formId;
    } else {
      const random = Math.random()
        .toString(36)
        .substring(2);
      this.file_data.keyValue = random;
      this.file_data2.keyValue = random;
    }
  },
  mounted() {
    queryService(this.path.edit_path, { id: this.formId }).then(res => {
      this.form.setFieldsValue(res.result);
      this.form.setFieldsValue({ tmpId: this.file_data.keyValue });
      return res.result;
    });
    this.spinning = false;
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      save(this, this.path.save_path);
    },
    // 数据联动
    onchange(values) {
      for (var key in values) {
        if (key === "simple") {
          this.form.setFieldsValue({ simple2: values[key] });
        }
      }
    },
    handlePrint() {
      const params = {
        keyValue: this.formId,
        service: "testservice",
        fileName: "测试"
      };
      download(this.path.print_path, params, params.fileName + ".pdf");
    },
    handleChooes() {}
  }
};
</script>
<style>
.ant-advanced-search-form {
  padding: 24px;
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}
</style>