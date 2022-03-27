<template>
<div v-if="items != undefined">
    <block class="chronology-view-inner">
    <div v-for="(item, index) in items" :key="index" class="chronology-line">
        <div v-if="items[index].name == 'cardChange'">
            <div class="chronology-line__header">
                <div class="__header-point"></div>
                <span>[{{getTime(items[index].time)}}] Внесен ответ:</span> 
            </div>
            <div class="card-block">
                <div class="card-block-inner">
                    <component 
                    :is="items[index].state.type+'Card_result'" 
                    :data="items[index].state"
                    />
                </div>
            
            </div>
        </div>
        <div v-else>
            {{ items[index].name }}
        </div>
    </div>
    </block>
</div>  
</template>

<script>
//Simple
import SimpleCard_result from "./TestCards/Result/Simple";
//Choice
import ChoiceCard_result from "./TestCards/Result/Choice";
//Orthoepy
import OrthoepyCard_result from "./TestCards/Result/Orthoepy";


export default {
    components:{
        SimpleCard_result, ChoiceCard_result, OrthoepyCard_result
    },
    props: ['data'],
    data(){
        return{
            items: [],
        }
    },
    created(){
        this.items = this?.data || [];
    },
    methods:{
        getTime(time){
            let newTime = new Date(time);
            let minutes = newTime.getMinutes().toString();
            minutes = minutes.length == 1 ? '0'+minutes : minutes;
            return newTime.getHours()+':'+minutes;
        }
    },
}
</script>

<style scoped>
.chronology-line{
    border-left: 3px solid #6f6f6f;
    padding-left: 16px;
    margin-left: 10px;
}
.chronology-view-inner .card-block{
    border: 1px solid #dfdfdf;
    background-color: #f8f8f8;
    border-radius: 8px;
}
.card-block-inner{
    margin: 8px 12px;
}
.chronology-line__header {
    font-weight: bold;
    padding-top: 12px;
    padding-bottom: 4px;
}
.chronology-line__header .__header-point{
    position: absolute;
    width: 32px;
    height: 32px;
    background-color: white;
    border-radius: 160%;
    margin-left: -34px;
    margin-top: -8px;
    border: 3px solid #444444;
}
</style>