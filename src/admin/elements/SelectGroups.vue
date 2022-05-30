<template>
<div>
    <div>
        <div class="p-inputtext">
            <table class="admin-table" v-if="selectedItems.length > 0">
                <tbody>
                    <tr>
                        <th>№</th>
                        <th>Группа</th>
                    </tr>
                    <tr v-for="(item, index) in selectedItems" :key="item.gr_id" class="table-row" @click="ClickRow(item)" :class="{'__isremoved':isRemovedItem(item)}">
                        <td>{{index+1}}.</td>
                        <td class="td-user-name" >{{item.name}}</td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="table-empty-label"> Пусто </div>
            <it-button @click="isModalItems = true" style="width: 100%" icon="add">Добавить</it-button>
        </div>
    </div>

<!-- Поиск пользователей -->
<it-modal v-model="isModalItems">
  <template #header>
    <h3 style="margin: 10px 0px">Добвление групп</h3>
  </template>
  <template #body>

<div class="selected-adding-items">
    <span v-for="item in addingItems" :key="item.gr_id" @click="ClickSelectRow(item)">
        {{ item.name }}
    </span>
</div>
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
                <div v-for="(item) in AddItems.list.items" :key="item.gr_id" @click="ClickSelectRow(item)" class="find-users-list_row" :class="{'__ishave': isHaveRow(item), '__isselected': isSelectedRow(item) }">
                    <span style="color: gray; margin-right: 10px">{{item.gr_id}}.</span><span class="__label">{{item.name}}</span>
                </div>
            </div>
        </div>
        <p-button v-if="AddItems.list?.isMore" label="Загрузить ещё" @click="AddItems.list.Load()" :loading="AddItems.list.isLoading"  class="p-button-secondary p-button-text" />

  </template>
  <template #actions>
    <it-button @click="isModalItems = false">Отмена</it-button>
    <it-button
      type="primary"
      @click="ModalBtnAddItems()">Добавить</it-button
    >
  </template>
</it-modal>
</div>
</template>

<script>
import List from '@/others/ListManager';

export default {
    components:{},
    props: ['items'],
    data(){
        return{
            isModalItems: false,

            selectedItems: this.items,

            removedItems:[],
            addingItems:[], //Добавляемые записи для модального окна

            AddItems: {
                loading: false,
                findText: '',
                list: null,
                isDesc: true,
            }
        }
    },
    created(){
        this.AddItems.list = List.Create(null, 'adm_get_groups', 'gr_id', 50, this.AddItems.isDesc, ()=>{
            console.log('Loaded');
        });
    },
    mounted(){

    },
    watch:{
        isModalItems(val){
            if(val){
                this.AddItems.list.Refresh();
                this.addingItems = [];
            }
        },
        items(val){
            this.selectedItems = val;
        }
    },
    methods:{
        GetItems(){
            let arr = [];
            for (let i = 0; i < this.selectedItems.length; i++) {
                const el = this.selectedItems[i];
                if(this.removedItems.find(itm=>itm.gr_id == el.gr_id) == undefined){
                    arr.push(el);
                }
                
            }
            return arr;
        },
        FindItems(){
            this.AddItems.list.Find(this.AddItems.findText);
        },
        RefreshItems(){
            this.AddItems.list.isDesc = this.AddItems.isDesc;
            this.AddItems.list.Refresh();
        },
        isHaveRow(item){
            let ret = false;
            if(this.selectedItems.find((itm)=>itm.gr_id == item.gr_id)){
                ret = true;
            }
            return ret;
        },
        isSelectedRow(item){
            let ret = false;
            if(this.addingItems.find((itm)=>itm.gr_id == item.gr_id)){
                ret = true;
            }
            return ret;
        },
        isRemovedItem(item){
            let ret = false;
            if(this.removedItems.find(itm=>itm.gr_id == item.gr_id)){
                ret = true;
            }
            return ret;
        },
        ClickRow(item){
            if(this.isRemovedItem(item)){
                for (let i = 0; i < this.removedItems.length; i++) {
                    const el = this.removedItems[i];
                    if(el.gr_id == item.gr_id){
                        this.removedItems.splice(i, 1);
                        break;
                    }
                }
            }else{
                this.removedItems.push(item);
            }
        },
        ModalBtnAddItems(){
            this.selectedItems.splice(this.selectedItems.length, 0, ...this.addingItems);
            this.addingItems = [];
            this.isModalItems = false;
        },
        ClickSelectRow(item){
            if(this.isHaveRow(item) == false)
            if(this.isSelectedRow(item)){
               for (let i = 0; i < this.addingItems.length; i++) {
                   const el =  this.addingItems[i];
                   if(el.gr_id == item.gr_id){
                       this.addingItems.splice(i, 1);
                       break;
                   }
               } 
            }else{
                this.addingItems.push(item);
            }
            
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
    color: gray;
    text-decoration: line-through;
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