<template>
  <div>
    <s-list v-if="currentTab === 'list'" @edit="edit"/>
    <s-form v-if="currentTab === 'add'" :formId="id" :type="type" @edit="edit"/>
  </div>
</template>

<script>
import SList from "./List";
import SForm from "./Form";

export default {
  name: "Main_Test3",
  components: {
    SList,
    SForm
  },
  data() {
    return {
      currentTab: "list",
      id: "",
      type: ""
    };
  },
  methods: {
    edit(data) {
      this.currentTab = data.state;
      this.id = data.id;
      this.type = data.type;
    }
  }
};
</script>
