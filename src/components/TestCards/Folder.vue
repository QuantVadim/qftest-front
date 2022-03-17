<template>
<div>
  <div v-if="dt != undefined" class="folder-content">

      <div class="part-1" @click="Open">
        <div class="__folder-img"></div>
        <div class="__count-cards"> {{ dt?.body?.length || 0 }} шт.</div>
      </div>
      <div class="part-2">
        <it-input v-model="dt.name" />
        <InputText type="text" v-model="name" />
      </div>
    
  </div>
  <div v-else>Пусто</div>
</div>
</template>

<script>
import InputText from 'primevue/inputtext';

export default {
  components: [InputText],
  props: ['data'],
  data(){
    return{
      dt: this?.data,
      name: '',
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

<style scoped>

.folder-content{
  display: grid;
  grid-template-columns: 64px 1fr;
}

.folder-content .part-1{
  cursor: pointer;
  transition: transform 0.2s;
}

.folder-content .__folder-img{
  height: 64px;
  width: 64px;
  background-image: var(--url-ico-folder);
  background-repeat: no-repeat;
  background-size: cover;
}
.folder-content .part-1:hover{
  transform: scale(1.1);
}

.folder-content .__count-cards{
  margin-top: -20px;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.548);
  width: max-content;
  border-radius: 4px;
  outline: 1px solid rgb(201, 201, 201);
  padding: 1px;
  max-width: 54px;
  overflow: hidden;
  max-height: 20px;
  line-height: 20px;
}

</style>