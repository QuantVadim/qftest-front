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
            <span>
                <p-checkbox id="isShowPassword" v-model="isShowPassword" :binary="true" />
                <label for="isShowPassword"> Показать пароль</label>
            </span>
        </div>
        
         
        <br>
        <p-button label="Обновить" @click="list.Refresh()" :disabled="list.isLoading"  class="p-button-secondary p-button-text" />
        <div v-if="list && list?.items">
            <table class="admin-table">
                <tbody>
                    <tr>
                        <th>Код</th>
                        <th>Логин</th>
                        <th>Пароль</th>
                        <th>Фамилия</th>
                        <th>Имя</th>
                        <th>Тип</th>
                        <th>Создатель</th>
                    </tr>
                    <tr v-for="(item) in list.items" :key="item.def_usr_id" class="table-row" @click="ClickRow(item)">
                        <td>{{item.def_usr_id}}</td>
                        <td>{{item.login}}</td>
                        <td>{{ isShowPassword ? item.password : '***'}}</td>
                        <td>{{item.last_name}}</td>
                        <td>{{item.first_name}}</td>
                        <td>{{getUserType(item.user_type)}}</td>
                        <td>{{item.creator_name}}</td>
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
            isShowPassword: false,
            customerService: null,

            onSave: (itm)=>{
                if(itm?.name == 'onSave'){
                    this.list.SetBy(itm.data, 'def_usr_id');
                }else if(itm?.name == 'onCreated'){
                    this.list.Refresh();
                }else if(itm?.name == 'onDeleted'){
                    this.list.DeleteBy('def_usr_id', itm.data)
                }
            },
        }
    },
    created(){
        this.list = List.Create(null, 'adm_get_def_users', 'def_usr_id', 50, this.isDesc, ()=>{
            console.log('Loaded');
        });
    },
    mounted(){
        this.list.Load();
        EventBus.$on('AccountEditor', this.onSave);
    },
    unmounted(){
        EventBus.$off('AccountEditor', this.onSave);
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
            EventBus.$emit('AccountEditor', {name: 'open', data: item} );
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