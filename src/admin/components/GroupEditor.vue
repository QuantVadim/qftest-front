<template>
<div>
<it-modal v-model="isShow">
  <template #header>
    <div class="model-header-wrapper">
        <h3 style="margin: 0">{{ gr_id ? 'Редактирование' : 'Создание'}} группы</h3>
        <span v-if="gr_id" style="height: 0px">
            <p-button type="button" class="p-button-rounded p-button-secondary p-button-text" @click="toggleMenu" icon="pi pi-ellipsis-h" />
            <Menu ref="menu" :model="menuItems" :popup="true" />
        </span>
    </div>
  </template>
  <template #body>
    <div v-if="dt">
        <div v-if="isLoading == false" class="editor-body">
            <div>
                <div>Код: {{ gr_id ? gr_id : 'новый'}}</div>
            </div>
            <span class="p-float-label">
                <InputText id="com_name" type="text" v-model="dt.name" />
                <label for="com_name">Название</label>
            </span>
            <span class="p-float-label">
                <InputText id="com_description" type="text" v-model="dt.description" />
                <label for="com_description">Описание</label>
            </span>
            <span>
                <label class="my-label-form">Куратор</label>
                <SelectUser ref="ElementSelectUser" :item="user" />
            </span>
            <span style="margin-top: -10px">
                <span class="field-checkbox" title="Приватная группа не отображается в поиске групп. Войти в нее можно только по коду вступления">
                    <p-checkbox id="ch-private" v-model="dt.private" :binary="true" />
                    <label for="ch-private"> Приватная</label>
                </span>
                <span class="field-checkbox checkbox-close" style="margin-left: 16px" title="После закрытия, доступ к группе никто получить не сможет. Открыть будет иметь возможность, либо администратор, либо куратор группы">
                    <p-checkbox id="ch-closed" v-model="dt.closed" :binary="true" />
                    <label for="ch-closed"> Закрытая</label>
                </span>
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
      >{{gr_id ? 'Сохранить' : 'Создать'}}</it-button
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
import SelectUser from '@/admin/elements/SelectUser.vue';

export default {
    components:{
        Menu, SelectUser
    },
    props: ['active', 'data'],
    data(){
        return{
            isShow: this.active,
            gr_id: null,
            dt: null,
            user: null,
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
                this.gr_id = null;
                this.dt = {
                    gr_id: null,
                    name: '',
                    description: '',
                    usr_id: null,
                    closed: false,
                    private: false,
                } 
            }else{
                this.gr_id = val.gr_id;
                this.isLoading = true;
                let obj = {
                    me: this.$store.state.ME.data,
                    q: 'adm_get_group',
                    gr_id: val.gr_id,
                }
                this.axios.post(this.apiurl, obj).then(itm=>{
                    if(itm.data?.data){
                        this.dt = itm.data.data;
                        this.user = itm.data.user;
                        this.dt.private = this.dt.private == 1;
                        this.dt.closed = this.dt.closed == 1;
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
                q: 'adm_group_save',
                data: this.dt,
            };
            const usr = this.$refs?.ElementSelectUser.GetItem();
            if(usr?.usr_id){
                obj.data.usr_id = usr?.usr_id;
            }
            this.isSaving = true;
            this.axios.post(this.apiurl, obj).then(itm=>{
                if(itm.data?.data){
                    if(itm.data?.event == 'onEdited'){
                        EventBus.$emit('GroupEditor', { name: 'onSave', 'data': itm.data.data});
                    }else{
                        EventBus.$emit('GroupEditor', { name: 'onCreated', 'data': itm.data.data});
                    }
                }else{
                    this.$error('Ошибка', 'Некорректные данные' || itm.data?.error);
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
                q: 'adm_group_delete',
                gr_id: this.gr_id,
            }
            this.axios.post(this.apiurl, obj).then(itm=>{
                if(itm.data?.data){
                    EventBus.$emit('GroupEditor', { name: 'onDeleted', 'data': itm.data.data});
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
.checkbox-close .p-checkbox-box.p-highlight{
    background-color: rgb(212, 89, 89) !important;
}
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