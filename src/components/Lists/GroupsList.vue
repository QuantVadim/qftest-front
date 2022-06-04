<template>
<div>
  <div v-if=" tab != undefined && tab != 'Управляемые' && listRecomended?.items.length > 0">
    <div class="groups-recomended-block">
      <label class="groups-recomended-block_label">Рекомендуемые группы:</label>
      <div v-for="(item, index) in listRecomended.items" :key="index">
        <GroupCard :data="item" />
        <Divider v-if="listRecomended?.items.length-1 != index" />
      </div>
    </div>
  </div>
  <div v-for="(item, index) in listGroups.items" :key="index">
    <GroupCard :data="item" />
    <Divider />
  </div>
  <div v-if="!listGroups.isLoading && !listGroups.isMore && listGroups.items.length == 0" class="center gray">Здесь ничего нет</div>
  <it-button @click="listGroups.Load()" :loading="listGroups.isLoading" v-if="listGroups.isMore" block
        >Еще</it-button>
  </div>
</template>

<script>
import Divider from "primevue/divider";
import GroupCard from "../Items/Group.vue";

import List from "@/others/ListManager";

export default {
  components:{
    Divider, GroupCard
  },
  props: ['tab', 'com'],
  data() {
    return {

      listRecomended: null,
      listGroups: null,
    };
  },
  created(){
        this.listRecomended = List.Create(null, 'get_my_groups_default', 'gr_id', 50, true, ()=>{
            console.log('Loaded');
        });
        this.listGroups = List.Create(null, 'get_my_groups', 'gr_id', 50, true, ()=>{
            console.log('Loaded');
        });
        this.listGroups.props = [{name: 'com_id', value: this.com}, {name:'type', value: this.tab == "Управляемые"? 'my' : 'in'}];
  },
  watch:{
    com(){
      this.listGroups.props = [{name: 'com_id', value: this.com}, {name:'type', value: this.tab == "Управляемые"? 'my' : 'in'}];
      this.listGroups.Refresh();
    }
  },
  methods:{

  },
  mounted(){
    this.listRecomended.Load();
    this.listGroups.Load();

  }
}
</script>

<style scoped>
.groups-recomended-block{
  background-color: rgb(244 244 244);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgb(224 224 224);
  margin-bottom: 16px;
}
.groups-recomended-block_label{
  margin-bottom: 10px;
  display: block;
  color: gray;
}
</style>