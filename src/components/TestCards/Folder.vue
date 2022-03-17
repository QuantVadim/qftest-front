<template>
<div>
  <div v-if="dt != undefined">
    <it-input v-model="dt.name" />
    <it-button @click="Open">Открыть</it-button>
    <div> Кол-во: {{ dt?.body?.length || 0 }} шт. </div>
  </div>
  <div v-else>Пусто</div>
</div>
</template>

<script>

export default {
  components: [],
  props: ['data'],
  data(){
    return{
      dt: this?.data,
    }
  },
  methods:{
    Open(){
      if(this?.dt?.id){
        this.$router.push({query: {folder: this.dt.id}});
      }
    },
    UpdateList(){
      this.$emit('changeList', this.items);
    },
  },
  setup() {
    
  },
}
</script>