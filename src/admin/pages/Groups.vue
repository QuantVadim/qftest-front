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
                        <th>Куратор</th>
                        <th>Состав</th>
                        <th>Приватность</th>
                        <th>Закрытость</th>
                    </tr>
                    <tr v-for="(item) in list.items" :key="item.gr_id" class="table-row" @click="ClickRow(item)">
                        <td>{{item.gr_id}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.description}}</td>
                        <td>{{item.autor_name}}</td>
                        <td>{{item.count_users}}</td>
                        <td class="text-center"><it-icon v-if="item.private == 1" name="check_circle" color="#686868" /></td>
                        <td class="text-center"><it-icon v-if="item.closed == 1" name="check_circle" color="#686868" /></td>
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
                    this.list.SetBy(itm.data, 'gr_id');
                }else if(itm?.name == 'onCreated'){
                    this.list.Refresh();
                }else if(itm?.name == 'onDeleted'){
                    this.list.DeleteBy('gr_id', itm.data)
                }
            },
        }
    },
    created(){
        this.list = List.Create(null, 'adm_get_groups', 'gr_id', 50, this.isDesc, ()=>{
            console.log('Loaded');
        });
    },
    mounted(){
        this.list.Load();
        EventBus.$on('GroupEditor', this.onSave);
    },
    unmounted(){
        EventBus.$off('GroupEditor', this.onSave);
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
            EventBus.$emit('GroupEditor', {name: 'open', data: item} );
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
.text-center{
    text-align: center;
}
</style>