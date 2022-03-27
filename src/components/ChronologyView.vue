<template>
<div v-if="items != undefined">
    <block>
    <div v-for="(item, index) in items" :key="index" class="chronology-view-inner">
        <div v-if="items[index].name == 'cardChange'">
            [{{getTime(items[index].time)}}] Внесен ответ:
            <block>
            <component 
                :is="items[index].state.type+'Card_result'" 
                :data="items[index].state"
            />
            </block>
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
            return newTime.getHours()+':'+newTime.getMinutes();
        }
    },
}
</script>

<style scoped>
.chronology-view-inner .block{
    border: 1px solid #dfdfdf;
    background-color: #f8f8f8;
}
</style>