<template>
    <div>
    <block>
        <div class="tool-panel">
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
                        <th>Фамилия</th>
                        <th>Имя</th>
                        <th>Тип</th>
                        <th>Аккаунт</th>
                    </tr>
                    <tr v-for="(item) in list.items" :key="item.usr_id" class="table-row" @click="ClickRow(item)">
                        <td>{{item.usr_id}}</td>
                        <td>{{item.last_name}}</td>
                        <td>{{item.first_name}}</td>
                        <td>{{getUserType(item.user_type)}}</td>
                        <td>{{getAccountType(item.social_network)}}</td>
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
                    this.list.SetBy(itm.data, 'usr_id');
                }else if(itm?.name == 'onDeleted'){
                    this.list.DeleteBy('usr_id', itm.data);
                }
            },
        }
    },
    created(){
        this.list = List.Create(null, 'adm_get_users', 'usr_id', 50, this.isDesc, ()=>{
            console.log('Loaded');
        });
    },
    mounted(){
        this.list.Load();
        EventBus.$on('UserEditor', this.onSave);
    },
    unmounted(){
        EventBus.$off('UserEditor', this.onSave);
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
            EventBus.$emit('UserEditor', {name: 'open', data: item});
        },
        getUserType(val){
            let ret = 'Ученик';
            switch (val) {
                case 'admin':
                    ret = 'Администратор';
                    break;
                case 'mentor':
                    ret = 'Учитель';
                    break;
            }
            return ret;
        },
        getAccountType(val){
            return val == 'vk' ? 'Вконтакте' : "Стандартный";
        },

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