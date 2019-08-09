<template>
  <div>
    <s-list v-if="currentTab === 'list'" :searchCode="searchCode" @edit="edit" @search="search" />
  </div>
</template>

<script>
import SList from "./List";

export default {
  name: "Main_Process_Definition",
  components: {
    SList
  },
  data() {
    return {
      currentTab: "list",
      id: "",
      type: "",
      searchCode: ""
    };
  },
  methods: {
    edit(data) {
      this.currentTab = data.state;
      this.id = data.id;
      this.type = data.type;
    },
    search(value) {
      this.searchCode = value;
    }
  }
};
</script>
