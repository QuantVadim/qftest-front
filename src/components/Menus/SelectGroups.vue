<template>
  <div>
    <br>
    <div v-for="(item, index) in items" :key="index">
      <label class="itm-group" :for="'itmgr_'+item.gr_id">
      <div>
        <it-checkbox v-model="item.checked" :id="'itmgr_'+item.gr_id" @input="toCash" />
      </div>
      <it-avatar :size="'50px'" :text="item.name" :src="item?.ico_url" />
      <div class="itm-gresult-center">
        <h3 class="card-test-title"><span>{{ item.name }}</span></h3>
        <div class="result-card-score">Участников: {{item.count_users }}</div>
      </div>
    </label>
    <it-divider/>
    </div>
    <it-button @click="Load" :loading="isLoading" v-if="isButtonLoad" block
      >Еще</it-button>
  </div>
</template>

<script>
export default {
  props:['data', 'value'],
  data(){
    return{
      items: [],
      isLoading: false,
      isButtonLoad: true,
    }
  },
  watch:{
  },
  methods:{
    toCash(){
      setTimeout(()=>{
        this.$emit('cash', this.items);
        let list = [];
        this.items.forEach(element => {
          if(element?.checked == true) list.splice(0, 0, element.gr_id)
        });
        this.$emit('change', list);
      }, 0);
    },
    async Load() {
      if (this.isLoading) return false;
      this.isLoading = true;
      this.isButtonLoad = true;
      let obj = {
        q: "get_my_groups",
        me: this.$store.state.ME.data,
        type: 'my',
        desc: true,
        count: 30,
      };
      if (this.items.length > 0)
        obj.point = this.items[this.items.length - 1].gr_id;

      this.axios.post(this.apiurl, obj).then((itm) => {
        console.log(itm.data);
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
        }
        this.isLoading = false;
      });
    },
  },
  mounted(){
    // setInterval(() => {
    //   console.log(Object.entries(this.checks), this.checks);
    // }, 2000);
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
  }
}
</script>

<style scoped>
.it-checkbox-wrapper{
  margin-top: 14px;
}

.itm-gresult-center{
  margin-left: 6px;
}
.result-card-score{
  text-align: left;
  color: gray;
}
.itm-group{
  display: grid;
  grid-template-columns: auto auto 1fr;
}
h3{
  margin: 0px;
}


</style>