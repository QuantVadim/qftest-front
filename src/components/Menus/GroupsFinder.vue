<template>
<div>
<it-modal v-model="isOpen">

  <template #header>
    <h3 style="margin: 0">Поиск групп</h3>
  </template>

  <template #body>
    <span class="p-input-icon-left" style="width: 100%; margin-top: 10px">
        <i class="pi pi-search" />
        <InputText type="text" v-model="finder" placeholder="Поиск" style="width: 100%" @change="Find" />
    </span>
    <div style="margin-top: 10px">
        <div v-for="item in list.items" :key="item.gr_id">
            <GroupCard :data="item"  @on-select="isOpen = false"/>
            <Divider />
        </div>
        <div v-if="!list.isLoading && !list.isMore && list.items.length == 0" class="center gray">Ничего не найдено</div>
        <it-button @click="list.Load()" :loading="list.isLoading" v-if="list.isMore" block>Еще</it-button>
    </div>
  </template>
  <template #actions>
    <it-button
      @click="isOpen = false"
      >Закрыть</it-button
    >
  </template>
</it-modal>
</div>    
</template>

<script>
import List from '@/others/ListManager';
import GroupCard from '@/components/Items/Group';
import Divider from "primevue/divider";

export default {
    components:{GroupCard, Divider},
    props:['modelValue'],
    data(){
        return{
            isOpen: false,

            finder: '',
            list: null,
        }
    },
    created(){
        this.list = List.Create(null, 'get_find_groups', 'gr_id', 50);
    },
    beforeMount(){
        this.isOpen = this.modelValue;
    },
    mounted(){
        this.list.Load();
    }, 
    watch:{
        modelValue(val){
            this.isOpen = val;
        },
        isOpen(val){
            if(val == false){
            this.$emit('update:modelValue',  false);
            }
        }
    },
    methods:{
        Find(){
            this.list.Find(this.finder);
        }
    }

}
</script>

<style scoped>

</style>