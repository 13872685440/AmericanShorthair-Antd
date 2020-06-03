<template>
  <div id="userLayout" :class="['login', device]">
    <div class="head">
      <h2>{{project_name}}</h2>
    </div>
    <route-view></route-view>
  </div>
</template>

<script>
import RouteView from "./RouteView";
import { mixinDevice } from '@/utils/mixin'
import { PROJECT_NAME } from "@/store/mutation-types";

export default {
  name: "UserLayout",
  components: { RouteView },
  mixins: [mixinDevice],
  data() {
    return {
      project_name: PROJECT_NAME
    };
  },
  mounted() {
    document.querySelector("body").setAttribute("style", "margin:0px");
  },
  beforeDestroy() {}
};
</script>

<style lang="less" scoped>
.login {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  .head {
    height: 62px;
    background-color: #fff;
    padding: 0 10%;
    h2 {
      font-size: 16px;
      font-weight: inherit;
      float: left;
      height: 62px;
      line-height: 62px;
      text-align: left;
      cursor: pointer;
      margin: 0;
      padding: 0;
    }
  }
}
</style>
