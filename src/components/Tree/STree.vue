<template>
  <div class="tree-wrapper">
    <a-input-search style="margin-bottom: 8px" placeholder="搜索" @change="onChange" v-if="search" />
    <a-tree
      @expand="onExpand"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      :treeData="dataSource"
      :selectedKeys="selectedKeys"
      @select="select"
    >
      <template slot="title" slot-scope="{title}">
        <span v-if="title.indexOf(searchValue) > -1" :title="title">
          {{title.substr(0, title.indexOf(searchValue))}}
          <span style="color: #f50">{{searchValue}}</span>
          {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
        </span>
        <span v-else :title="title">{{title}}</span>
      </template>
    </a-tree>
  </div>
</template>
<script>
export default {
  props: {
    expandedKeys: {
      type: Array
    },
    autoExpandParent: {
      type: Boolean
    },
    selectedKeys: {
      type: Array
    },
    dataSource: {
      type: Array
    },
    search: {
      type: Boolean,
      default: false
    },
    searchValue: {
      type: String
    }
  },
  methods: {
    select(item) {
      this.$emit("select", item);
    },
    onExpand(item) {
      this.$emit("expand", item);
    },
    onChange(e) {
      this.$emit("change", e);
    }
  }
};
</script>
