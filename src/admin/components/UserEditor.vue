<template>
<div>
<it-modal v-model="isShow">
  <template #header>
      <div class="model-header-wrapper"> 
          <h3 style="margin: 0">Редактирование пользователя</h3>
          <span v-if="usr_id" style="height: 0px">
            <p-button type="button" class="p-button-rounded p-button-secondary p-button-text" @click="toggleMenu" icon="pi pi-ellipsis-h" />
            <Menu ref="menu" :model="menuItems" :popup="true" />
        </span>
      </div>
  </template>
  <template #body>
    <div v-if="dt">
        <div v-if="isLoading == false" class="editor-body">
            <div>
                <div>Код: {{ usr_id }}</div>
                <div style="margin-top: 10px" >Аккаунт: {{ getAccountType(dt.social_network) }}</div>
            </div>
            <span class="p-float-label">
                <InputText id="last_name" type="text" v-model="dt.last_name" />
                <label for="last_name">Фамилия</label>
            </span>
            <span class="p-float-label">
                <InputText id="first_name" type="text" v-model="dt.first_name" />
                <label for="first_name">Имя</label>
            </span>
            <span>
                <label class="my-label">Тип</label>
                <Dropdown v-model="dt.user_type" :options="userTypes" optionLabel="name" optionValue="value" placeholder="Ученик" />
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
      >Сохранить</it-button
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
import Dropdown from 'primevue/dropdown';

export default {
    components:{
        Dropdown, Menu
    },
    props: ['active', 'data'],
    data(){
        return{
            isShow: this.active,
            usr_id: null,
            dt: null,

            isLoading: false,
            isSaving: false,

            confirmDelete: false,

            userTypes: [
                {name: 'Ученик', value: null},
                {name: 'Учитель', value: 'mentor'},
                {name: 'Администратор', value: 'admin'},
            ],
            menuItems: [
				{
					label: 'Удалить',
					icon: 'pi pi-times',
					command: ()=>{this.confirmDelete = true},

				},
			],
        }
    },
    mounted(){
    },
    watch:{
        active(val){
           if(val) this.isShow = val;
           else{
               this.isShow = false;
           }
        },
        isShow(val){
            if(val == false) this.$emit('close');
        },
        data(val){
            this.usr_id = val.usr_id;
            this.isLoading = true;
            let obj = {
                me: this.$store.state.ME.data,
                q: 'adm_get_user',
                usr_id: val.usr_id,
            }
            this.axios.post(this.apiurl, obj).then(itm=>{
                if(itm.data?.data){
                    this.dt = itm.data.data;
                }
                this.isLoading = false;
            }).catch(()=>{
                this.isLoading = false;
            })
        }
    },
    methods:{
        Save(){
            let obj = { 
                me: this.$store.state.ME.data,
                q: 'adm_user_save',
                data: this.dt,
            };
            this.isSaving = true;
            this.axios.post(this.apiurl, obj).then(itm=>{
                if(itm.data?.data){
                    EventBus.$emit('UserEditor', { name: 'onSave', 'data': itm.data.data});
                }else{
                    this.$error('Ошибка сохранения', this.data?.error || 'Неизвестная ошибка');
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
                q: 'adm_user_delete',
                usr_id: this.usr_id,
            }
            this.axios.post(this.apiurl, obj).then(itm=>{
                if(itm.data?.data){
                    EventBus.$emit('UserEditor', { name: 'onDeleted', 'data': itm.data.data});
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
        },

        getAccountType(val){
            return val == 'vk' ? 'Вконтакте' : "Стандартный";
        },
    }
}
</script>

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