<template>
  <div class="login_main">
    <div class="login_content">
      <div class="login_header">
        <div class="login_type">登录</div>
      </div>
      <div class="login_box">
        <a-form id="loginForm" ref="loginForm" :form="form" @submit="handleSubmit">
          <div id=".login_main_errortip" style="color: red; padding-bottom: 10px;"></div>
          <div class="login_input_content">
            <a-form-item>
              <a-input
                class="login_input"
                size="large"
                type="text"
                placeholder="请输入用户名"
                v-decorator="[
                'username',
                {rules: [{ required: true, message: '请输入用户名' }], validateTrigger: 'blur'}
              ]"
              ></a-input>
            </a-form-item>
          </div>
          <div class="login_input_content">
            <a-form-item>
              <a-input 
                class="login_input"
                size="large"
                type="password"
                placeholder="请输入密码"
                v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
              ></a-input>
            </a-form-item>
          </div>
          <div class="login_input_content">
            <a-form-item style="margin-top:24px">
              <a-button
                size="large"
                type="primary"
                htmlType="submit"
                class="login_button"
                :loading="state.loginBtn"
                :disabled="state.loginBtn"
              >登录</a-button>
            </a-form-item>
          </div>
        </a-form>
        <div class="login_input_content">
          <router-link :to="{ name: 'registration'}">
            <a href style="float:left">注册账号</a>
          </router-link>
          <a href style="float:right">忘记密码</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import md5 from "md5";
import { mapActions } from "vuex";

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
      }
    };
  },
  methods: {
    ...mapActions(["Login"]),
    handleSubmit(e) {
      e.preventDefault();
      const {
        form: { validateFields },
        state,
        Login
      } = this;

      state.loginBtn = true;

      const validateFieldsKey = ["username", "password"];

      validateFields(validateFieldsKey, { force: false }, (err, values) => {
        if (!err) {
          const loginParams = { ...values };
          delete loginParams.username;
          loginParams[!state.loginType ? "username" : "username"] =
            values.username;
          loginParams.password = md5(md5(values.password));
          loginParams.service = "webLoginService";
          Login(loginParams)
            .then(() => this.loginSuccess())
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false;
            });
        } else {
          setTimeout(() => {
            state.loginBtn = false;
          }, 600);
        }
      });
    },
    loginSuccess() {
      this.$router.push({ name: "index" });
      // 延迟 1 秒显示欢迎信息
      // setTimeout(() => {
      // this.$notification.success({
      // message: "欢迎",
      // description: `，欢迎回来`
      // });
      // }, 2000);
    },
    requestFailed(err) {
      this.$notification.error({
        message: "登陆失败",
        description: err.message || {} || "请求出现错误，请稍后再试"
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../style/login.less");
</style>