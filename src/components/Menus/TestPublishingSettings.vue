<template>
  <div class="test-settings">
  <TabView>
  <TabPanel header="Ограничения">
    <!-- Кол-во попыток -->
    <div class="p-field-checkbox">
      <Checkbox id="is_limit_attempts" v-model="stg.is_limit_attempts" :binary="true" />
      <label for="is_limit_attempts"><span>Ограничить попытки</span>
        <div style="color: gray">Ограничив попытки, пользоватили смогут пройти тест только то кол-во раз, которое вы укажете</div>
      </label>
      <div class="test-share-sttg-two-columns" v-if="stg.is_limit_attempts">
      <InputNumber v-model="stg.limit_attempts" mode="decimal" :step="1" showButtons buttonLayout="horizontal" :min="1" :max="100" style="width:4rem" :style="'width:32px'"
                 incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
    </div> 
    </div>
     <Divider />
     <!-- Отведенное время -->
    <div class="p-field-checkbox">
      <Checkbox id="is_duration_time" v-model="stg.is_duration_time" :binary="true" />
      <label for="is_duration_time"><span>Время выполнения</span>
        <div style="color: gray">Время, в течении которого, тест должен быть написан</div>
      </label>
      <div class="test-share-sttg-two-columns" v-if="stg.is_duration_time">
        <div class="p-field p-col-12 p-md-4">
          <label for="time24">Минуты: </label>
          <InputNumber id="time24" v-model="stg.duration_time" mode="decimal" />
        </div>
      </div> 
    </div>
     <Divider />
    <!-- Доступен с -->
    <div class="p-field-checkbox">
      <Checkbox id="is_datetime_start" v-model="stg.is_date_start" :binary="true" />
      <label for="is_datetime_start"><span>Доступен с</span>
        <div style="color: gray">Время, С которого тест станет доступным. До этого времени пользователи будут видеть тест, но пройти его не смогут</div>
      </label>
      <div class="test-share-sttg-two-columns" v-if="stg.is_date_start">
      <Calendar v-model="stg.date_start" :showTime="true" :maxDate="stg.is_date_end ? stg.date_end : undefined" :showButtonBar="true" :showIcon="true" />
      </div> 
    </div>
     <Divider />
    <!-- Доступен до -->
    <div class="p-field-checkbox">
      <Checkbox id="is_datetime_end" v-model="stg.is_date_end" :binary="true" />
      <label for="is_datetime_end"><span>Доступен до</span>
        <div style="color: gray">Время, ДО которого тест будет доступным. После этого времени пользователи не смогут пройти тест</div>
      </label>
      <div class="test-share-sttg-two-columns" v-if="stg.is_date_end">
      <Calendar v-model="stg.date_end" :showTime="true" :minDate="stg.is_date_start ? stg.date_start : undefined" :showButtonBar="true" :showIcon="true" />
      </div> 
    </div>
     <Divider />
     
  </TabPanel>
  <TabPanel header="Оценивание">
    <div>
      <Dropdown v-model="stg.assessment" :options="assessments" optionLabel="label" placeholder="Выбрать..." />
      <AssessmentProps :data="stg?.assessment" @update="assessmentUpdate"/>
    </div>
  </TabPanel>
  </TabView>
  </div>
</template>

<script>
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';
import Divider from "primevue/divider";
import Dropdown from 'primevue/dropdown';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import AssessmentProps from '@/components/SettingsUnits/AssessmentProps'
import {Assessments} from "@/DataLib" //Каталог шкал оценивания

export default {
  components:{
    InputNumber, Checkbox, Divider, Calendar,
    TabView, TabPanel, Dropdown, AssessmentProps
  },
  props:['data'],
  beforeMount(){
    if(this?.data){
      this.stg = this.data;
    }
    console.log('go: ', this.stg, this.data);
  },
  data(){
    return{
      assessments: undefined,
      stg:{
        is_limit_attempts: false,
        limit_attempts: 1,
        is_date_start: false,
        is_date_end: false,
        date_start: new Date(),
        date_end: new Date(),
        is_duration_time: false,
        duration_time: 40,
      }
      
    }
  },
  methods:{
    assessmentUpdate(){
      console.log(this.stg);
    }
  },
  watch:{
  },
  mounted(){
    let isSet = false;
    this.assessments = JSON.parse(JSON.stringify(Assessments));
    this.assessments.splice(0, 0, {name:'default', label: 'По-умолчанию', fullName: 'Система оценивания по-умолчанию'});
    //Установка системы оценивания для теста, если она есть
    console.log('stg', this.stg?.assessment);
    if(this.stg?.assessment?.length > 0 || this.stg?.assessment?.name){
      this.stg.assessment = this.stg?.assessment?.name ? this.stg.assessment : JSON.parse(this.stg.assessment);
      for (let i = 0; i < this.assessments.length; i++) {
        const el = this.assessments[i];
        if(el.name == this.stg.assessment.name){
          if(this.assessments[i]?.body){
            this.assessments[i].body = this.stg.assessment.body;
          }
          this.stg.assessment = this.assessments[i];
          isSet = true;
          break;
        }
      }
    }
    if(isSet == false){
      this.stg.assessment = this.assessments[0];
    }
    //Сохранение параметров публикации при изменении
    this.$watch('stg', ()=>{
      this.$emit('cash', this.stg);
    }, {
      deep: true
    })
  }
}
</script>

<style scoped>
.p-dropdown-panel{
  z-index: 999999 !important;
}
</style>

<style>
.p-datepicker.p-component{
  z-index: 99999 !important;
}
.p-field-checkbox label span{
  line-height: 22px;
  font-size: 16px;
  padding-left: 4px;
  font-weight: bold;
}
.test-share-sttg-two-columns .p-inputnumber-input{
  width: 50px;
  text-align: center;
}
.test-share-sttg-two-columns{
padding-top: 6px;

}
.test-share-sttg-two-columns div:first-child{
  padding-right: 10px;
}
.test-settings .it-switch-label:first-child{
  font-weight: bold !important;
}
</style>