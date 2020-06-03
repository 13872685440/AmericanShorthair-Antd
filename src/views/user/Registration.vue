<template>
  <div class="registor_main">
    <div class="registor_body">
      <div id="container">
        <div id="context">
          <div>
            <div class="registor_head">欢迎注册</div>
            <div class="registor_tips">
              已有账号? 点击
              <router-link :to="{ name: 'login'}">
                <a href>登录</a>
              </router-link>
            </div>
          </div>
          <div id="registor_form">
            <a-form id="loginForm" ref="loginForm" :form="form" @submit="handleSubmit">
              <div class="registor_input_content">
                <a-form-item>
                  <a-input
                    class="registor_input"
                    size="large"
                    type="text"
                    placeholder="请输入手机号码"
                    v-decorator="[
                'phone',
                {rules: [{ required: true, message: '请输入手机号码' }], validateTrigger: 'blur'}
              ]"
                  ></a-input>
                </a-form-item>
              </div>
              <div class="registor_input_content">
                <a-form-item>
                  <a-input
                    class="registor_input_yzm"
                    size="large"
                    type="text"
                    placeholder="请输入短信验证码"
                    v-decorator="[
                'yzm',
                {rules: [{ required: true, message: '请输入短信验证码' }], validateTrigger: 'blur'}
              ]"
                  ></a-input>
                  <button
                    class="button_yzm"
                    type="button"
                    name="button"
                    @click="sendCode()"
                    v-show="show"
                  >获取短信验证码</button>
                  <button
                    class="button_yzm_time"
                    type="button"
                    name="button"
                    v-show="!show"
                  >{{sum}}s后重试</button>
                </a-form-item>
              </div>
              <div class="registor_input_content">
                <a-form-item>
                  <a-input
                    class="registor_input"
                    size="large"
                    type="password"
                    placeholder="请输入密码"
                    v-decorator="[
                'pwd',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
                  ></a-input>
                </a-form-item>
              </div>
              <div class="registor_input_content">
                <a-form-item>
                  <a-input
                    class="registor_input"
                    size="large"
                    type="password"
                    placeholder="请再次输入密码"
                    v-decorator="[
                'pwd2',
                {rules: [{ required: true, message: '请再次输入密码' }], validateTrigger: 'blur'}
              ]"
                  ></a-input>
                </a-form-item>
              </div>
              <div class="registor_input_content">
                <a-form-item>
                  <a-input
                    class="registor_input"
                    size="large"
                    type="text"
                    placeholder="请输入您的姓名"
                    v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入您的姓名' }], validateTrigger: 'blur'}
              ]"
                  ></a-input>
                </a-form-item>
                <a-form-item>
                  <a-tree-select
                    size="large"
                    :treeData="organData"
                    :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                    placeholder="请选择部门"
                    allowClear
                    treeDefaultExpandAll
                    v-decorator="[
          'organ_code', {
            rules: [{ required: true,message: '请选择部门' }],
          }]"
                  ></a-tree-select>
                </a-form-item>
              </div>
              <a-form-item>
                <a-button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  class="login_button"
                  :loading="state.loginBtn"
                  :disabled="state.loginBtn"
                >申请注册</a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import md5 from "md5";
import { getYzm } from "@/api/login";
import { queryService, saveService } from "@/api/manage";

export default {
  data() {
    return {
      loginBtn: false,
      // login type: 0 username 1 other
      loginType: 0,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 username, 1 other
        loginType: 0
      },
      show: true,
      sum: "",
      cansave: false,
      path: {},
      organData: []
    };
  },
  created() {
    this.path.organ_path =
      "/" + this.GLOBAL.MODEL_SYSTEM + "/organization/tree";
    this.path.save_path = "/" + this.GLOBAL.MODEL_SYSTEM + "/registration/save";
    queryService(this.path.organ_path, { userId: "admin" }).then(res => {
      this.organData = res.result;
    });
  },
  methods: {
    sendCode() {
      var time_count = 60;
      if (this.show) {
        var phone = this.form.getFieldValue("phone");
        if (phone == "" || phone == null) {
          this.show = true;
          this.$message.error("请输入手机号码");
          return;
        } else {
          let reg = /^1[3|4|5|7|8][0-9]{9}$/;
          if (reg.test(phone)) {
            getYzm(phone).then(res => {
              if (res.result == "sucess") {
                this.$message.success("验证码发送成功");
                this.cansave = true;
              } else {
                this.$message.error(res.result);
              }
            });
          } else {
            this.show = true;
            this.$message.error("您输入的手机号码格式错误");
            return;
          }
        }
        this.sum = time_count;
        this.show = false;
        var timer = setInterval(() => {
          if (this.sum > 1 && this.sum <= time_count) {
            this.sum--;
          } else {
            this.show = true;
            this.sum = "";
            clearInterval(timer);
          }
        }, 1000);
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      const {
        form: { validateFields },
        state
      } = this;

      state.loginBtn = true;
      validateFields((errors, values) => {
        if (!errors) {
          if (values.pwd != values.pwd2) {
            this.$message.error("两次密码输入不一致");
            state.loginBtn = false;
          } else {
            values.userId = "admin";
            values.pwd = md5(md5(values.pwd));
            saveService(this.path.save_path, values).then(res => {
              if (res.result == "sucess") {
                this.$router.push({ name: "login" });
                // 延迟 1 秒显示欢迎信息
                setTimeout(() => {
                  this.$notification.success({
                    message: "注册申请",
                    description: `申请成功`
                  });
                }, 500);
              } else {
                this.$message.error(res.result);
                state.loginBtn = false;
              }
            });
          }
        } else {
          state.loginBtn = false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../style/login.less");
</style>
<style>
.ant-select-selection__placeholder,
.ant-select-search__field__placeholder {
  font-size: 14px;
  padding: 0 10px;
  left: 0;
}
</style>