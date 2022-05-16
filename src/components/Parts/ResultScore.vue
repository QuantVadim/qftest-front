<template>
    <div v-if="assessment != undefined">
        <div v-if="data.ready == 1">
            <!-- Процентная шкала -->
            <div v-if="assessment?.name == 'procent'" class="grade-view _procent" style="height: 46px;">
                <Knob v-model="score" :min="0" :max="100" :size="50" :valueTemplate="score+'%'" readonly />
            </div>
            <!-- 5-бальная шкала -->
            <div v-else-if="assessment?.name == 'point5'" class="grade-view _point5">
                <div :class="'_point5_'+getPoint5()">{{ getPoint5() }}</div>
            </div>
            <div v-else-if="assessment?.name == 'star3'" class="grade-view _star3">
                <span class="star-view" style="font-size: 18px;">
                    <span :class="'star3_'+getPoint5()"></span>
                </span>
            </div>
        </div>
        <div v-else>
            <span><div class="pencil-writing" style=" padding: 10px"></div></span>
        </div>
    </div>
</template>

<script>
import Knob from 'primevue/knob';
import {Assessments} from '@/DataLib';

export default {
    components: {Knob},
    props: ['data'],
    data(){
        return{
            score: Math.floor((+this?.data.score/+this?.data.max_score)*100),
            assessment: undefined,
            Assessments,
        }
    },
    renderTracked(){
        this.score =  Math.floor((+this.data.score/+this.data.max_score)*100);
    },
    methods:{
        getPoint5(){//Пятибальная шкала: получение оценки
            let ret = '2';
            if(this?.assessment != undefined){
                for (let i = 0; i < this.assessment?.body?.length; i++) {
                const el = this.assessment.body[i];
                if(this.score >= el?.value ){
                    ret = el.label;
                }else{
                    break;
                }
            }
            }
            return ret;
        }
    },
    mounted(){
        if(this?.data != undefined && this?.data?.assessment?.length > 0){
            this.assessment = JSON.parse(this?.data?.assessment);
        }else if(this?.data?.assessment?.length == 0 || this?.data?.assessment?.length == null){
            this.assessment = JSON.parse(JSON.stringify(this.Assessments[0]));
        }
    }
}
</script>

<style scoped>

</style>