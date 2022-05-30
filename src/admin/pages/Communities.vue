<template>
    <div>
    <block>
        <div class="tool-panel">
            <span>
                <p-button @click="ClickRow()" label="Создать" icon="pi pi-plus" class="p-button-outlined" />
            </span>
            <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText type="text" v-model="findText" placeholder="Поиск" @change="Find" />
            </span>
            <span>
                <p-checkbox id="isDesc" v-model="isDesc" :binary="true" @change="Refresh" />
                <label for="isDesc"> Сначала новые</label>
            </span>
        </div>
        
         
        <br>
        <p-button label="Обновить" @click="list.Refresh()" :disabled="list.isLoading"  class="p-button-secondary p-button-text" />
        <div v-if="list && list?.items">
            <table class="admin-table">
                <tbody>
                    <tr>
                        <th>Код</th>
                        <th>Название</th>
                        <th>Описание</th>
                        <th>Состав</th>
                        <th>Групп</th>
                    </tr>
                    <tr v-for="(item) in list.items" :key="item.com_id" class="table-row" @click="ClickRow(item)">
                        <td>{{item.com_id}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.description}}</td>
                        <td>{{item.count_users}}</td>
                        <td>{{item.count_groups}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p-button v-if="list?.isMore" label="Загрузить ещё" @click="list.Load()" :loading="list.isLoading"  class="p-button-secondary p-button-text" />

    </block>
    </div>
</template>

<script>
import List from '@/others/ListManager';
import EventBus from '@/EventBus';

export default {
    components: {
        
    },
    data(){
        return{
            loading: false,
            findText: '',
            list: null,
            isDesc: true,

            onSave: (itm)=>{
                if(itm?.name == 'onSave'){
                    this.list.SetBy(itm.data, 'com_id');
                }else if(itm?.name == 'onCreated'){
                    this.list.Refresh();
                }else if(itm?.name == 'onDeleted'){
                    this.list.DeleteBy('com_id', itm.data)
                }
            },
        }
    },
    created(){
        this.list = List.Create(null, 'adm_get_communities', 'com_id', 50, this.isDesc, ()=>{
            console.log('Loaded');
        });
    },
    mounted(){
        this.list.Load();
        EventBus.$on('CommunityEditor', this.onSave);
    },
    unmounted(){
        EventBus.$off('CommunityEditor', this.onSave);
    },
    methods:{
        Find(){
            this.list.Find(this.findText);
        },
        Refresh(){
            this.list.isDesc = this.isDesc;
            this.list.Refresh();
        },
        ClickRow(item){
            EventBus.$emit('CommunityEditor', {name: 'open', data: item} );
        }
    }
}
</script>


<style scoped>
.tool-panel{
    display: flex;
    align-items: center;
    column-gap: 12px;
}
</style>