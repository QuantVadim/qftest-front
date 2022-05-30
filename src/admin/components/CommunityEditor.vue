<template>
<div>
<it-modal v-model="isShow">
  <template #header>
    <div class="model-header-wrapper">
        <h3 style="margin: 0">{{ com_id ? 'Редактирование' : 'Создание'}} класса</h3>
        <span v-if="com_id" style="height: 0px">
            <p-button type="button" class="p-button-rounded p-button-secondary p-button-text" @click="toggleMenu" icon="pi pi-ellipsis-h" />
            <Menu ref="menu" :model="menuItems" :popup="true" />
        </span>
    </div>
  </template>
  <template #body>
    <div v-if="dt">
        <div v-if="isLoading == false" class="editor-body">
            <div>
                <div>Код: {{ com_id ? com_id : 'новый'}}</div>
            </div>
            <span class="p-float-label">
                <InputText id="com_name" type="text" v-model="dt.name" />
                <label for="com_name">Название</label>
            </span>
            <span class="p-float-label">
                <InputText id="com_description" type="text" v-model="dt.description" />
                <label for="com_description">Описание</label>
            </span>
            <span v-if="com_id">
                <label class="my-label-form">Состав класса</label>
                <SelectUsers ref="ElementSelectUsers" :items="users" />
            </span>
            <span v-if="com_id">
                <label class="my-label-form">Группы по-умолчанию</label>
                <SelectGroups ref="ElementSelectGroups" :items="groups" />
            </span>
        </div>
        
    </div>
      

  </template>
  <template #actions>
    <it-button
      @click="$emit('close')"
      >Отмена</it-button
    >
    <it-button
      type="primary"
      @click="Save"
      :loading='isSaving'
      >{{com_id ? 'Сохранить' : 'Создать'}}</it-button
    >
  </template>
</it-modal>     


<it-modal v-model="confirmDelete">
  <template #header>
    <h3>Удаление записи</h3>
  </template>
  <template #body>
    Вы уверены, что хотите удалить запись?
  </template>
  <template #actions>
    <it-button @click="confirmDelete = false">Отмена</it-button>
    <it-button type="danger" @click="DeleteRow">Удалить</it-button>
  </template>
</it-modal>


</div>    
</template>

<script>
import EventBus from '@/EventBus.js';

import Menu from 'primevue/menu';
import SelectUsers from '@/admin/elements/SelectUsers.vue';
import SelectGroups from '@/admin/elements/SelectGroups.vue';

export default {
    components:{
        Menu, SelectUsers, SelectGroups
    },
    props: ['active', 'data'],
    data(){
        return{
            isShow: this.active,
            com_id: null,
            dt: null,
            users: [],
            groups: [],

            isLoading: false,
            isSaving: false,
            
            confirmDelete: false, 

            menuItems: [
				{
					label: 'Удалить',
					icon: 'pi pi-times',
					command: ()=>{this.confirmDelete = true},

				},
			]
        }
    },
    mounted(){
    },
    watch:{
        active(val){
           if(val){
               this.isShow = val;
           }
           else{
               this.isShow = false;
           }
        },
        isShow(val){
            if(val == false) this.$emit('close');
        },
        data(val){
            if(val == undefined){
                this.com_id = null;
                this.dt = {
                    com_id: null,
                    name: '',
                    description: '',
                } 
            }else{
                this.com_id = val.com_id;
                this.isLoading = true;
                let obj = {
                    me: this.$store.state.ME.data,
                    q: 'adm_get_community',
                    com_id: val.com_id,
                }
                this.axios.post(this.apiurl, obj).then(itm=>{
                    if(itm.data?.data){
                        this.dt = itm.data.data;
                        this.users = itm.data.users;
                        this.groups = itm.data.groups;
                    }
                    this.isLoading = false;
                }).catch(()=>{
                    this.isLoading = false;
                })
            }
        }
    },
    methods:{
        Save(){
            let obj = { 
                me: this.$store.state.ME.data,
                q: 'adm_community_save',
                data: this.dt,
            };
            if(this.com_id){
                obj.users = this.$refs.ElementSelectUsers.GetItems();
                obj.groups = this.$refs.ElementSelectGroups.GetItems();
            }
            this.isSaving = true;
            this.axios.post(this.apiurl, obj).then(itm=>{
                if(itm.data?.data){
                    if(itm.data?.event == 'onEdited'){
                        EventBus.$emit('CommunityEditor', { name: 'onSave', 'data': itm.data.data});
                    }else{
                        EventBus.$emit('CommunityEditor', { name: 'onCreated', 'data': itm.data.data});
                    }
                }
                this.isSaving = false;
            }).catch(()=>{
                this.isSaving = false;
            })
        },
        DeleteRow(){
            this.confirmDelete = false;
            this.isSaving = true;
            let obj = {
                me: this.$store.state.ME.data,
                q: 'adm_community_delete',
                com_id: this.com_id,
            }
            this.axios.post(this.apiurl, obj).then(itm=>{
                if(itm.data?.data){
                    EventBus.$emit('CommunityEditor', { name: 'onDeleted', 'data': itm.data.data});
                }else{
                    this.$error('Ошибка удаления', itm.data?.error || 'Неизвестная ошибка');
                }
                this.isSaving = false;
            }).catch(()=>{
                this.isSaving = false;
            });
        },
        toggleMenu(event) {
            this.$refs.menu.toggle(event);
        }
    }
}
</script>

<style>
.p-menu.p-component{
    z-index: 999999 !important;
}
</style>

<style scoped>
.editor-body{
    display: grid;
    grid-template-columns: 100%;
    grid-row-gap: 32px;
}
.p-inputtext{
    width: 100%;
}
label.my-label{
    margin-left: 0.5rem; 
    margin-bottom: 8px; 
    color: #6c757d; 
    font-size: 12px;
    position: absolute;
    pointer-events: none;
    margin-top: -1.2rem;
    line-height: 1;
}
.model-header-wrapper{
    display: grid;
    grid-template-columns: 1fr auto;
}



</style>