<template>
  <div>
    <!--Окно просмотра результатов -->
    <it-modal v-model="val">
      <template #header
        ><h3 class="modal-header">{{ data?.name }}</h3></template
      >
      <template #body>
        <div>
        <div v-if="isMentor() && classes.length > 2">
          <Dropdown v-model="selectedClass" :options="classes" optionLabel="name" optionValue="com_id" placeholder="Все" />
        </div>
        <it-button
          class="btn-update"
          icon="update"
          :class="{ 'opacity-none': isLoading }"
          @click="updateList"
          text
          >Обновить</it-button
        >
        <div v-for="(item, index) in listResults.items" :key="index" >
          <ResultCard :data="item" @delete="toDeleteResult" :index="index" />
          <Divider />
        </div>
        <div
          v-if="!listResults.isLoading && !listResults.isMore && listResults.items.length == 0"
          class="center gray"
        >
          Здесь ничего нет
        </div>
        <it-button @click="Load" :loading="listResults.isLoading" v-if="listResults.isMore" block
          >Еще</it-button
        >
        </div>
      </template>
      <template #actions>
        <it-button @click="setEnable(false)">Закрыть</it-button>
      </template>
    </it-modal>
    <!-- /Окно просмотра результатов -->
    <it-modal v-model="isWinDelResult">
      <template #header>
        <h3>Удаление решения</h3>
      </template>
      <template #body>
        <p>
          Вы уверены, что хотите удалить решение пользователя
          <b> {{ curDelResult?.user_name }}</b
          >?
        </p>
      </template>
      <template #actions>
        <it-button @click="this.isWinDelResult = false">Отмена</it-button>
        <it-button :loading="isDeletingResult" @click="DeleteResult" type="danger">Удалить</it-button>
      </template>
    </it-modal>
  </div>
</template>

<script>
import Divider from "primevue/divider";
import ResultCard from "../Items/GResult.vue";
import Dropdown from 'primevue/dropdown';

import List from "@/others/ListManager";

export default {
  components: {
    Divider,
    ResultCard, Dropdown
  },
  props: ['modelValue', "data"],
  data() {
    return {
      val: false,
      items: [],
      isLoading: false,
      isButtonLoad: true,
      isOpen: true,
      gt_id_last: undefined,

      isWinDelResult: false,
      curDelResult: undefined,
      curDelResultIndex: undefined,
      isDeletingResult: false,

      selectedClass: null,
      classes:[],

      listResults: null,
    };
  },
  created(){
    this.listResults = List.Create(null, 'get_group_results', 'res_id', 50, true);
    this.listResults.props = 
      [{name:'gr_id', value: this.$route.params.id}, 
      {name: 'gt_id', value: this?.data?.gt_id}, 
      {name:'com_id', value: this.selectedClass}];
  },
  beforeMount(){
    this.val = this.modelValue;
  },
  mounted() {
  },
  methods: {
    async LoadClasses(){
      let obj = {
        me: this.$store.state?.ME.data,
        q: 'get_classes_groups',
        gr_id: this.data.gr_id,
      }
      this.classes = [{name: 'Все', com_id: null}];
      this.axios.post(this.API, obj).then((itm)=>{
        console.log(itm.data);
        if(itm.data?.data){
          this.classes.splice(this.classes.length, 0, ...itm.data?.data);
        }else{
          this.$error('Ошибка запроса групп', 'Ошибка' || this.data?.error);
        }
      }).catch(()=>{
        this.$error('Ошибка запроса групп', 'Ошибка сети');
      })
    },
    isMentor(){
      return this.$store.state?.ME.data?.user_type == 'admin' || this.$store.state?.ME.data?.user_type == 'mentor';
    },
    toDeleteResult(data, index) {
      this.curDelResult = data;
      this.curDelResultIndex = index;
      this.isWinDelResult = true;
    },
    DeleteResult() {
      if (this.isDeletingResult) return false;
      this.isDeletingResult = true;
      let obj = {
        q: "delete_result",
        me: this.$store.state.ME.data,
        res_id: this.curDelResult.res_id,
      };
      this.axios.post(this.apiurl, obj).then((itm) => {
        this.isDeletingResult = false;
        this.isWinDelResult = false;
        console.log(itm.data);
        if (itm.data?.data){
          this.$Notification.success({
            title: "Решение удалено",
            text: `Решение было успешно удалено`,
            placement: 'bottom-right',
          });
          this.items.splice(this.curDelResultIndex, 1);
        }else if(itm.data?.error){
          this.$Notification.danger({
            title: "Ошибка удаления",
            text: itm.data?.error,
            placement: 'bottom-right',
          });
        }
      });
    },
    setEnable(enable) {
      this.$emit("set-enable", enable);
    },
    updateList() {
      this.listResults.props = 
        [{name:'gr_id', value: this.$route.params.id}, 
        {name: 'gt_id', value: this?.data?.gt_id}, 
        {name:'com_id', value: this.selectedClass}];
      this.LoadClasses();
      this.listResults.Refresh();
    },
    async Load() {
      this.listResults.props = 
        [{name:'gr_id', value: this.$route.params.id}, 
        {name: 'gt_id', value: this?.data?.gt_id}, 
        {name:'com_id', value: this.selectedClass}];
      this.listResults.Load();
    },
  },
  watch: {
    selectedClass(){
      this.listResults.props =
        [{name:'gr_id', value: this.$route.params.id}, 
        {name: 'gt_id', value: this?.data?.gt_id}, 
        {name:'com_id', value: this.selectedClass}];
      this.listResults.Refresh();
    },
    modelValue(val){
      this.val = val;
    },
    val(val){
      if(val){
        setTimeout(() => {
          if(this.data.gt_id != this.gt_id_last)
            this.updateList();
        }, 0);
      }else{
        this.gt_id_last = this?.data?.gt_id;
      }
      this.$emit('update:modelValue', val);
    },
    isOpen() {
      this.setEnable(this.isOpen);
    },
  },
};
</script>