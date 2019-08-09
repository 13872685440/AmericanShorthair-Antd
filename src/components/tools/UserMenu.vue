<template>
  <div class="user-wrapper">
    <div class="content-box">
      <a
        href="https://www.yuque.com/docs/share/3797ee37-8c43-4976-9c81-188f06fb90ab"
        target="_blank"
      >
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a>
      <!--<notice-icon class="action"/>-->
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar()" />
          <span>{{ nickname() }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <a href="javascript:;" @click="$refs.password.add()">
              <a-icon type="lock" />
              <span>修改密码</span>
            </a>
          </a-menu-item>
          <a-menu-item key="1">
            <a href="javascript:;" @click="$refs.service.add()">
              <a-icon type="info-circle" />
              <span>技术支持</span>
            </a>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="2">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <s-service ref="service"></s-service>
    <make-password ref="password"></make-password>
  </div>
</template>

<script>
// import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from "vuex";
import SService from "./modules/Service";
import MakePassword from "./modules/MakePassword";

export default {
  name: "UserMenu",
  components: {
    SService,
    MakePassword
    // NoticeIcon
  },
  methods: {
    ...mapActions(["Logout"]),
    ...mapGetters(["nickname", "avatar"]),
    handleLogout() {
      const that = this;

      this.$confirm({
        title: "提示",
        content: "真的要注销登录吗 ?",
        onOk() {
          return that
            .Logout({})
            .then(() => {
              window.location.reload();
            })
            .catch(err => {
              that.$message.error({
                title: "错误",
                description: err.message
              });
            });
        },
        onCancel() {}
      });
    }
  }
};
</script>
