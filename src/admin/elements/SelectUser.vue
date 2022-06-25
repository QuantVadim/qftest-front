<template>
<div>
    <div>
        <div class="p-inputtext">
            <div v-if="selectedItem != undefined" class="td-user-name" style="margin-bottom: 6px" >
                <span>
                    <it-avatar :src="selectedItem?.avatar" size="36px"/>
                </span>
                <span style="margin-left: 6px; font-size: 16px">{{selectedItem.last_name+' '+selectedItem.first_name}}</span>
            </div>
            <div v-else class="table-empty-label"> Не выбран </div>
            <it-button @click="isModalItems = true" style="width: 100%" icon="edit">Изменить</it-button>
        </div>
    </div>

<!-- Поиск пользователей -->
<it-modal v-model="isModalItems">
  <template #header>
    <h3 style="margin: 10px 0px">Выбор пользователя</h3>
  </template>
  <template #body>

<span class="p-input-icon-left"  style="width: 100%;" >
    <i class="pi pi-search" />
    <InputText type="text" v-model="AddItems.findText" placeholder="Поиск" @change="FindItems"  style="width: 100%; margin-top: 10px; margin-bottom: 10px" />
</span>
<div class="tool-panel">
            <span>
                <p-checkbox id="UsersisDesc" v-model="AddItems.isDesc" :binary="true" @change="RefreshItems" />
                <label for="UsersisDesc"> Сначала новые</label>
            </span>
        </div>
         
        <br>
        <p-button label="Обновить" @click="AddItems.list.Refresh()" :disabled="AddItems.list.isLoading"  class="p-button-secondary p-button-text" />
        <div v-if="AddItems.list && AddItems.list?.items">
            <div class="find-users-list">
                <div v-for="(item) in AddItems.list.items" :key="item.usr_id" @click="ClickSelectRow(item)" class="find-users-list_row" :class="{'__ishave': isHaveRow(item), '__isselected': isSelectedRow(item) }">
                    <span style="color: gray; margin-right: 10px">{{item.usr_id}}.</span><span class="__label">{{item.last_name+' '+item.first_name}}</span>
                </div>
            </div>
        </div>
        <p-button v-if="AddItems.list?.isMore" label="Загрузить ещё" @click="AddItems.list.Load()" :loading="AddItems.list.isLoading"  class="p-button-secondary p-button-text" />

  </template>
  <template #actions>
    <it-button @click="isModalItems = false">Отмена</it-button>
  </template>
</it-modal>
</div>
</template>

<script>
import List from '@/others/ListManager';

export default {
    components:{},
    props: ['item', 'types'],
    data(){
        return{
            isModalItems: false,

            selectedItem: this.item,

            removedItems:[],

            AddItems: {
                loading: false,
                findText: '',
                list: null,
                isDesc: true,
            }
        }
    },
    created(){
        this.AddItems.list = List.Create(null, 'adm_get_users', 'usr_id', 50, this.AddItems.isDesc, ()=>{
            console.log('Created');
        });
        this.AddItems.list.props.push({name: 'types', value: 'admin,mentor'});
    },
    mounted(){

    },
    watch:{
        isModalItems(val){
            if(val){
                this.AddItems.list.Refresh();
            }
        },
        item(val){
            this.selectedItem = val;
        }
    },
    methods:{
        GetItem(){
            return this.selectedItem;
        },
        FindItems(){
            this.AddItems.list.Find(this.AddItems.findText);
        },
        RefreshItems(){
            this.AddItems.list.isDesc = this.AddItems.isDesc;
            this.AddItems.list.Refresh();
        },
        isHaveRow(item){
            return this.selectedItem?.usr_id == item?.usr_id;
        },
        isSelectedRow(item){
            return this.selectedItem?.usr_id == item.usr_id;
        },
        isRemovedItem(item){
            let ret = false;
            if(this.removedItems.find(itm=>itm.usr_id == item.usr_id)){
                ret = true;
            }
            return ret;
        },
        ClickSelectRow(item){
            this.selectedItem = item;
            this.isModalItems = false;
        }
    }
}
</script>

<style scoped>

.td-user-name{
    width: 100%;
}
.tool-panel{
    display: flex;
}
.find-users-list_row{

    padding: 6px;
}
.find-users-list_row:nth-child(2n){
    background-color: rgb(241, 241, 241);
}
.find-users-list_row:hover{
    outline: 1px solid gray;
  background-color: #b9d0fc;
  cursor: pointer;
}
.find-users-list_row.__ishave{
    font-weight: bold;
    background-color: inherit;
}
.find-users-list_row.__isselected{
    font-weight: bold;
}
.find-users-list_row.__isselected .__label{
    text-decoration: underline;
}
.find-users-list_row.__ishave:nth-child(2n){
    background-color: rgb(241, 241, 241);
}
.selected-adding-items{
    display: flex;
    flex-wrap: wrap;
    row-gap: 4px;
    column-gap: 4px;
}
.selected-adding-items>span{
    animation: enter-show 0.1s;
    background-color: #e3edff;
    border: 1px solid #b4cdfd;
    border-radius: 13px;
    padding: 4px 7px;
}
.selected-adding-items>span:hover{
    background-color: rgb(252, 209, 209);
    text-decoration: line-through;
    cursor: pointer;
}
.table-row.__isremoved{
    color: gray;
    text-decoration: line-through;
}
.table-empty-label{
    color: gray;
    margin-bottom: 10px;
    text-align: center;
}


</style>