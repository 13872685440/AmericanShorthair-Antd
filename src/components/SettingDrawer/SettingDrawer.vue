<template>
  <div class="setting-drawer" ref="settingDrawer">
    <a-drawer
      width="300"
      placement="right"
      @close="onClose"
      :closable="false"
      :visible="visible"
      :getContainer="() => $refs.settingDrawer"
      :style="{}"
    >
      <div class="setting-drawer-index-content">
        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">整体风格设置</h3>

          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template slot="title">暗色菜单风格</template>
              <div class="setting-drawer-index-item" @click="handleMenuTheme('dark')">
                <img src="~@/assets/style/style_dark.svg" alt="dark" />
                <div class="setting-drawer-index-selectIcon" v-if="navTheme === 'dark'">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template slot="title">亮色菜单风格</template>
              <div class="setting-drawer-index-item" @click="handleMenuTheme('light')">
                <img src="~@/assets/style/style_light.svg" alt="light" />
                <div class="setting-drawer-index-selectIcon" v-if="navTheme !== 'dark'">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>
          </div>
        </div>

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">主题色</h3>

          <div style="height: 20px">
            <a-tooltip
              class="setting-drawer-theme-color-colorBlock"
              v-for="(item, index) in colorList"
              :key="index"
            >
              <template slot="title">{{ item.key }}</template>
              <a-tag :color="item.color" @click="changeColor(item.color)">
                <a-icon type="check" v-if="item.color === primaryColor"></a-icon>
              </a-tag>
            </a-tooltip>
          </div>
        </div>
        <a-divider />

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">导航模式</h3>

          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template slot="title">侧边栏导航</template>
              <div class="setting-drawer-index-item" @click="handleLayout('sidemenu')">
                <img src="~@/assets/style/style_sidemenu.svg" alt="sidemenu" />
                <div class="setting-drawer-index-selectIcon" v-if="layoutMode === 'sidemenu'">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template slot="title">顶部栏导航</template>
              <div class="setting-drawer-index-item" @click="handleLayout('topmenu')">
                <img src="~@/assets/style/style_topmenu.svg" alt="topmenu" />
                <div class="setting-drawer-index-selectIcon" v-if="layoutMode !== 'sidemenu'">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>
          </div>
          <div :style="{ marginTop: '24px' }">
            <a-list :split="false">
              <a-list-item>
                <a-tooltip slot="actions">
                  <template slot="title">该设定仅 [顶部栏导航] 时有效</template>
                  <a-select
                    size="small"
                    style="width: 80px;"
                    :defaultValue="contentWidth"
                    @change="handleContentWidthChange"
                  >
                    <a-select-option value="Fixed">固定</a-select-option>
                    <a-select-option value="Fluid" v-if="layoutMode !== 'sidemenu'">流式</a-select-option>
                  </a-select>
                </a-tooltip>
                <a-list-item-meta>
                  <div slot="title">内容区域宽度</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :defaultChecked="fixedHeader"
                  @change="handleFixedHeader"
                />
                <a-list-item-meta>
                  <div slot="title">固定 Header</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :disabled="!fixedHeader"
                  :defaultChecked="autoHideHeader"
                  @change="handleFixedHeaderHidden"
                />
                <a-list-item-meta>
                  <a-tooltip slot="title" placement="left">
                    <template slot="title">固定 Header 时可配置</template>
                    <div :style="{ opacity: !fixedHeader ? '0.5' : '1' }">下滑时隐藏 Header</div>
                  </a-tooltip>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :disabled="(layoutMode === 'topmenu')"
                  :defaultChecked="fixSiderbar"
                  @change="handleFixSiderbar"
                />
                <a-list-item-meta>
                  <div
                    slot="title"
                    :style="{ textDecoration: layoutMode === 'topmenu' ? 'line-through' : 'unset' }"
                  >固定侧边菜单</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>
        <a-divider />

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">其他设置</h3>
          <div>
            <a-list :split="false">
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :defaultChecked="colorWeak"
                  @change="onColorWeak"
                />
                <a-list-item-meta>
                  <div slot="title">色弱模式</div>
                </a-list-item-meta>
              </a-list-item>
             <!-- <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :defaultChecked="multiTab"
                  @change="onMultiTab"
                />
                <a-list-item-meta>
                  <div slot="title">多页签模式</div>
                </a-list-item-meta>
              </a-list-item>-->
            </a-list>
          </div>
        </div>
        <a-divider />

        <a-button
          block
          type="primary"
          htmlType="submit"
          class="login_button"
          @click="doSave"
        >保存</a-button>
      </div>
      <div class="setting-drawer-index-handle" @click="toggle">
        <a-icon type="setting" v-if="!visible" />
        <a-icon type="close" v-else />
      </div>
    </a-drawer>
  </div>
</template>

<script>
import config from "@/config/defaultSettings";
import Vue from 'vue'
import {
  DEFAULT_COLOR,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR_WEAK,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_TAB
} from '@/store/mutation-types'
import {
  updateTheme,
  updateColorWeak,
  colorList,
  saveStyle
} from "./settingConfig";
import { mixin, mixinDevice } from "@/utils/mixin";

export default {
  mixins: [mixin, mixinDevice],
  data() {
    return {
      visible: true,
      colorList,
      baseConfig: {
        primaryColor: Vue.ls.get(DEFAULT_COLOR, config.primaryColor),
        navTheme: Vue.ls.get(DEFAULT_THEME, config.navTheme),
        layout:  Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout),
        contentWidth: Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth),
        fixedHeader: Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader),
        fixSiderbar: Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar),
        autoHideHeader: Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader),
        colorWeak: Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak),
        multiTab: Vue.ls.get(DEFAULT_MULTI_TAB, config.multiTab)
      }
    };
  },
  watch: {},
  mounted() {
    const vmx = this;
    setTimeout(() => {
      vmx.visible = false;
    }, 16);
    // 当主题色不是默认色时，才进行主题编译
    if (this.primaryColor !== config.primaryColor) {
      updateTheme(this.primaryColor);
    }
    if (this.colorWeak !== config.colorWeak) {
      updateColorWeak(this.colorWeak);
    }
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    toggle() {
      this.visible = !this.visible;
    },
    onColorWeak(checked) {
      this.baseConfig.colorWeak = checked;
      this.$store.dispatch("ToggleWeak", checked);
      updateColorWeak(checked);
    },
    onMultiTab(checked) {
      this.baseConfig.multiTab = checked;
      this.$store.dispatch("ToggleMultiTab", checked);
    },
    handleMenuTheme(theme) {
      this.baseConfig.navTheme = theme;
      this.$store.dispatch("ToggleTheme", theme);
    },
    doSave() {
      const text = {
        primaryColor: this.baseConfig.primaryColor,
        navTheme: this.baseConfig.navTheme,
        layout: this.baseConfig.layout,
        contentWidth: this.baseConfig.contentWidth,
        fixedHeader: this.baseConfig.fixedHeader,
        fixSiderbar: this.baseConfig.fixSiderbar,
        autoHideHeader: this.baseConfig.autoHideHeader,
        colorWeak: this.baseConfig.colorWeak,
        multiTab: this.baseConfig.multiTab
      };
      const path = "/" + this.GLOBAL.MODEL_SYSTEM + "/info/style";
      saveStyle(path, text);
    },
    handleLayout(mode) {
      this.baseConfig.layout = mode;
      this.$store.dispatch("ToggleLayoutMode", mode);
      // 因为顶部菜单不能固定左侧菜单栏，所以强制关闭
      //
      this.handleFixSiderbar(false);
    },
    handleContentWidthChange(type) {
      this.baseConfig.contentWidth = type;
      this.$store.dispatch("ToggleContentWidth", type);
    },
    changeColor(color) {
      this.baseConfig.primaryColor = color;
      if (this.primaryColor !== color) {
        this.$store.dispatch("ToggleColor", color);
        updateTheme(color);
      }
    },
    handleFixedHeader(fixed) {
      this.baseConfig.fixedHeader = fixed;
      this.$store.dispatch("ToggleFixedHeader", fixed);
    },
    handleFixedHeaderHidden(autoHidden) {
      this.baseConfig.autoHideHeader = autoHidden;
      this.$store.dispatch("ToggleFixedHeaderHidden", autoHidden);
    },
    handleFixSiderbar(fixed) {
      if (this.layoutMode === "topmenu") {
        this.baseConfig.fixSiderbar = false;
        this.$store.dispatch("ToggleFixSiderbar", false);
        return;
      }
      this.baseConfig.fixSiderbar = fixed;
      this.$store.dispatch("ToggleFixSiderbar", fixed);
    }
  }
};
</script>

<style lang="less" scoped>
.setting-drawer-index-content {
  .setting-drawer-index-blockChecbox {
    display: flex;

    .setting-drawer-index-item {
      margin-right: 16px;
      position: relative;
      border-radius: 4px;
      cursor: pointer;

      img {
        width: 48px;
      }

      .setting-drawer-index-selectIcon {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        padding-top: 15px;
        padding-left: 24px;
        height: 100%;
        color: #1890ff;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
  .setting-drawer-theme-color-colorBlock {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    float: left;
    cursor: pointer;
    margin-right: 8px;
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
    color: #fff;
    font-weight: 700;

    i {
      font-size: 14px;
    }
  }
}

.setting-drawer-index-handle {
  position: absolute;
  top: 240px;
  background: #1890ff;
  width: 48px;
  height: 48px;
  right: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  z-index: 1001;
  text-align: center;
  font-size: 16px;
  border-radius: 4px 0 0 4px;

  i {
    color: rgb(255, 255, 255);
    font-size: 20px;
  }
}
</style>
