<template>
  <div class="home">
    <block>
      <h3>Главная</h3>

      <it-button
      class="btn-update"
      icon="update"
      :class="{ 'opacity-none': isLoading }"
      @click="updateList"
      text
      >Обновить</it-button
    >
    <div v-for="(item, index) in items" :key="index">
      <GTest :data="item" @show-results="showResults" />
      <Divider />
    </div>
    <div
      v-if="!isLoading && !isButtonLoad && items.length == 0"
      class="center gray"
    >
      Здесь ничего нет
    </div>
    <it-button @click="Load" :loading="isLoading" v-if="isButtonLoad" block
      >Еще</it-button>
    </block>

    <GResultsViewer
      v-model="isWinResults"
      :data="curDataResults"
      @set-enable="WinShowResults"
    />
  </div>
</template>

<script>
import GTest from "../../components/Items/GTest.vue";
import Divider from "primevue/divider";
import GResultsViewer from "@/components/Lists/GResultsViewer.vue";

export default {
  name: 'Home',
  components: {
    GTest,
    Divider,
    GResultsViewer,
  },
  props: ["data"],
  data() {
    return {
      items: [],
      isLoading: false,
      isButtonLoad: true,

      isWinResults: false,
      curDataResults: null,
    };
  },
  activated(){
    this.$emit('activated');
  },
  mounted() {
    if (this?.data) {
      this.items = this.data;
      if (this.items.length <= 30) {
        this.isButtonLoad = false;
      }
    } else {
      setTimeout(() => {
        this.Load();
      }, 0);
    }
  },
  beforeRouteLeave(to, from, next) {
    if(this.isWinResults){
      this.isWinResults = false;
      next(false);
      return;
    }
    next(true)
  },
  methods: {
    WinShowResults(show) {
      this.isWinResults = show;
    },
    showResults(data) {
      this.isWinResults = true;
      this.curDataResults = data;
    },
    updateList() {
      this.isButtonLoad = true;
      this.items = [];
      this.Load();
    },
    async Load() {
      if (this.isLoading) return false;
      this.isLoading = true;
      let obj = {
        q: "get_all_groups_tests",
        me: this.$store.state.ME.data,
        desc: true,
        count: 30,
      };
      if (this.items.length > 0)
        obj.point = this.items[this.items.length - 1].gt_id;

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
          this.$emit("cash", this.items);
          console.log(this.items);
        }
        this.isLoading = false;
      });
    },
  },
};
</script>
<style>
.btn-update {
    color: gray !important;
    padding-left: 3px !important;
    padding-right: 3px !important;
}

</style>