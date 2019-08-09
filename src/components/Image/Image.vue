<template>
  <a-modal :title="title" width="100%" :visible="visible" @cancel="handleCancel" :footer="null">
    <img :src="imgUrl" />
  </a-modal>
</template>
<script>
import { axios } from "@/utils/request";

export default {
  props: {
    title: {
      type: String
    },
    path: {
      type: String
    }
  },
  data() {
    return {
      imgUrl: "",
      visible: false
    };
  },
  created: function() {},
  methods: {
    add(params) {
      this.iniImage(params);
    },
    iniImage(params) {
      axios({
        url: this.path,
        method: "get",
        params: params,
        responseType: "arraybuffer"
      }).then(res => {
        this.imgUrl =
          "data:image/png;base64," +
          btoa(
            new Uint8Array(res).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
        this.visible = true;
      });
    },
    handleCancel() {
      this.visible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.ant-modal-content {
  overflow-x: scroll;
}
</style>