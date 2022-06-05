<template>
<div>
<Sidebar
      v-model:visible="isOpen"
      position="bottom"
      class="win-result"
    >
      <div class="sidebar-conent-center">
        <TestResult
          :key="$route.query?.result"
          :set-res-id="res_id"
        />
      </div>
</Sidebar>

</div>
</template>

<script>
import TestResult from "@/views/pages/TestResult.vue";
import Sidebar from "primevue/sidebar";

export default {
    components: {
        TestResult, Sidebar
    },
    data(){
        return{
            isOpen: false,
            res_id: null,
        }
    },
    watch:{
        '$route.query'(val){
            if(val?.result){
                this.res_id = val?.result;
                this.isOpen = true;
            }else{
                this.isOpen = false;
            }
        },
        isOpen(val){
            if(val == false){
                let obj = Object.assign({}, this.$route.query);
                delete obj.result; 
                this.$router.push({query: { ...obj}});
            }
        }
    },
    mounted(){
        if(this.$route.query?.result){
            this.res_id = this.$route.query.result;
            this.isOpen = true;
        }
    }
}
</script>

<style>

.win-result.p-sidebar {
  z-index: 9999999 !important;
}
.win-result.p-sidebar {
  height: 100vh !important;
  background-color: rgb(206, 206, 206);
}
.win-result .p-sidebar-header {
  box-shadow: 0px 8px 8px #cecece;
  z-index: 1;
}
.win-result .sidebar-conent-center {
  max-width: 700px;
  margin: auto;
}
.win-result .p-sidebar-content {
  margin: 0px;
  padding: 0px;
}

</style>