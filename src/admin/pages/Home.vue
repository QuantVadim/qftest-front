<template>
<div>
    <block>
        <h2>Статистика</h2>
        <table class="admin-table table-statistics" v-if="info != undefined ">
            <tbody>
                <tr>
                    <th>Пользователи</th>
                    <td>{{ info.count_users }} шт.</td>
                </tr>
                <tr>
                    <th>Группы</th>
                    <td>{{ info.count_groups }} шт.</td>
                </tr>
                <tr>
                    <th>Тесты</th>
                    <td>{{ info.count_tests }} шт.</td>
                </tr>
                <tr>
                    <th>Решения</th>
                    <td>{{ info.count_results }} шт.</td>
                </tr>
                <tr>
                    <th>Изображения</th>
                    <td>{{ info.count_images }} шт.</td>
                </tr>
                <tr>
                    <th>Размер изображений</th>
                    <td> <span v-if="info?.images_size > 0">{{ ( info?.images_size / (1024*1024) ).toFixed(2)+' МБ' }}</span><span v-else> 0 МБ</span></td>
                </tr>
            </tbody>
        </table>
    </block>
</div>
</template>

<script>
export default {
    data(){
        return{
            info: null,
        }
    },
    mounted(){
        this.Load();
    },
    methods:{
        Load(){
            let obj ={
                me: this.$store.state.ME.data,
                q: 'adm_get_statistics',
            }
            this.axios.post(this.API, obj).then(itm=>{
                if(itm.data?.data){
                    this.info = itm.data.data;
                }
            })
        }
    }

}
</script>

<style scoped>
.table-statistics{
    width: 100%;
}
.table-statistics th{
    width: 160px !important;

}


</style>