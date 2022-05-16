<template>
    <div class="assessment-wrapper">
        <div v-if="dt?.fullName != undefined" class="assessment_full-name">
            {{ dt?.fullName }}
        </div>
        <div v-if="type != undefined && dt?.body">
            <div v-if="dt.body.length > 0" style="margin: 6px 0px">
                <it-button @click="btnResetData" size="small">Сбросить</it-button>
            </div>
            <div v-for="(item, index) in dt.body" :key="index" class="row-step">
                <div class="step-label">
                    <span v-if="dt.name == 'point5'" style="font-family: primeicons;" class="grade-view _point5">
                        <div :class="'_point5_'+dt.body[index].label">{{dt.body[index].label}}</div>
                    </span>
                    <span v-else-if="dt.name == 'star3'" style="font-family: primeicons" class="star-view">
                        <span :class="'star3_'+dt.body[index].label"></span>
                    </span>
                    <span v-else>
                        {{item.label}}
                    </span>
                </div>
                <div class="step-description">{{item.description}}</div>
                <div v-if="index > 0">
                    <InputNumber v-model="item.value" :min="dt.body[index-1].value+1" :max="dt.body[index+1]?.value-1 || 100" inputStyle="width: 60px" suffix="%" showButtons buttonLayout="horizontal" mode="decimal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                </div>
            </div>
        </div>
        </div>
</template>

<script>
import {Assessments} from "@/DataLib" //Каталог шкал оценивания
import InputNumber from 'primevue/inputnumber';
export default {
    components:[ InputNumber ],
    props:['data'],
    data(){
        return{
            dt: undefined,
            type: undefined,
            Assessments,
            dd: [
                {value: 0, label: '2', description: 'Неуд.'},
                {value: 50, label: '3', description: 'Удовлет.'},
                {value: 75, label: '4', description: 'Хорошо'},
                {value: 95, label: '5', description: 'Отлично'}
            ]
    }},
    mounted(){
        if(this.data!=undefined){
            if(this.data?.name){
                this.type = this.data?.name;
                this.dt = this.data;
            }
            }
    },
    watch:{
        data(){
           if(this.data!=undefined){
            if(this.data?.name){
                this.type = this.data?.name;
                this.dt = this.data;
            }
            } 
        }
    },
    methods:{
        btnResetData(){
            let fdt = this.Assessments.filter((item) => item.name == this.type);
            if(fdt.length == 1) this.dt = JSON.parse(JSON.stringify(fdt[0]));
            this.$emit('update', JSON.parse(JSON.stringify(this.dt)));
        },
    },
    setup() {
        
    },
}
</script>

<style scoped>
.row-step{
    display: grid;
    grid-template-columns: auto 1fr 136px;
    align-items: center;
    column-gap: 10px;
    margin-bottom: 6px;
}
.row-step:nth-child(2n){
    background-color: rgb(238, 238, 238);
    border-radius: 6px;
}
.step-label{
    padding: 6px;
    background-color: rgb(228, 228, 228);
    border: 1px solid rgb(209, 209, 209);
    border-radius: 6px;
    font-size: 18px;
    font-weight: bold;
}
.step-description{
    vertical-align: middle;
}
.assessment_full-name{
    margin: 6px 0px;
}
</style>