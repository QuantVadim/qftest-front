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
  <div v-for="(item, index) in items" :key="index">
    <GroupCard :data="item" />
    <Divider />
  </div>
  <div v-if="!isLoading && !isButtonLoad && items.length == 0" class="center gray">Здесь ничего нет</div>
  <it-button @click="Load" :loading="isLoading" v-if="isButtonLoad" block
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
  props: ['tab'],
  data() {
    return {
      items: [],
      isLoading: false,
      isButtonLoad: true,

      listRecomended: null,
    };
  },
  created(){
        this.listRecomended = List.Create(null, 'get_my_groups_default', 'gr_id', 50, true, ()=>{
            console.log('Loaded');
        });
    },
  methods:{
    async Load() {
      if (this.isLoading) return false;
      this.isLoading = true;
      let obj = {
        q: "get_my_groups",
        me: this.$store.state.ME.data,
        type: this.tab == "Управляемые"? 'my' : 'in',
        desc: true,
        count: 30,
      };
      if (this.items.length > 0)
        obj.point = this.items[this.items.length - 1].gr_id;

      this.axios.post(this.apiurl, obj).then((itm) => {
        if (itm.data?.data) {
          if (itm.data.data.length > 0) {
            let leng = itm.data?.data.length;
            for (let i = 0; i < leng; i++) {
              this.items.push(itm.data?.data[i]);
            }
            if (leng < obj.count) this.isButtonLoad = false;
          } else {
            this.isButtonLoad = false;
          }
        }
        this.isLoading = false;
      });
    },
  },
  mounted(){
    this.listRecomended.Load();

    setTimeout(() => {
      this.Load();
    }, 0);
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