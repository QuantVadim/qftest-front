<template>
  <div>
      <!-- Создание группы -->
      <it-modal v-model="isWindowCreateGroup">
        <template #header
          ><h3 class="modal-header">Создание группы</h3></template
        >
        <template #body>
          <it-input
            v-model="newGroup.name"
            placeholder="Название группы"
          /><br />
          <it-textarea
            v-model="newGroup.description"
            placeholder="Описание группы"
          />
        </template>
        <template #actions>
          <it-button @click="isWindowCreateGroup = false">Отмена</it-button>
          <it-button @click="CreateGroup" type="primary">Создать</it-button>
        </template>
      </it-modal>
      <!-- /Создание группы -->
      <!-- Вступление в группу -->
      <it-modal v-model="isWindowJoinGroup">
        <template #header
          ><h3 class="modal-header">Вступить в группу</h3></template
        >
        <template #body>
          <it-input v-model="joinCode" placeholder="Код вступления" /><br />
        </template>
        <template #actions>
          <it-button @click="isWindowJoinGroup = false">Отмена</it-button>
          <it-button :loading="isJoinLoading" @click="JoinGroup" type="primary">Вступить</it-button>
        </template>
      </it-modal>
      <!-- /Вступление в группу -->
    <block>
      <h3>Группы:</h3>
      <it-button icon="add" v-if="isMentor()" @click="isWindowCreateGroup = true">Создать группу</it-button>
      <it-button icon="login" v-else @click="isWindowJoinGroup = true">Вступить в группу</it-button>
      <br>
      <!--<it-toggle v-model="tabGroup" :options="['В составе', 'Управляемые']" />  -->
        
        <div v-if="isMentor() && classes.length > 2">
          <Dropdown v-model="selectedClass" :options="classes" optionLabel="name" optionValue="com_id" placeholder="Все" />
        </div>
        <br>
        <GroupsList :key="tabGroup" :tab="tabGroup" :com="selectedClass" />
        <!-- <GroupCard :data="item" />
        <Divider /> -->
    </block>
  </div>
</template>

<script>
import GroupsList from "../../components/Lists/GroupsList.vue";
import Dropdown from 'primevue/dropdown';

export default {
  components: {
    GroupsList, Dropdown
  },
  data() {
    return {
      items: [],
      tabGroup: 'В составе',
      isWindowCreateGroup: false,
      isWindowJoinGroup: false,
      isJoinLoading: false,
      joinCode: "",
      newGroup: {
        name: "",
        description: "",
      },

      selectedClass: null,
      classes:[]
    };
  },
  activated(){
    this.$emit('activated');
  },
  beforeMount(){
    this.tabGroup = this.isMentor() ? 'Управляемые' : 'В составе';
    this.LoadClasses();
  },
  methods: {
    LoadClasses(){
      let obj = {
        me: this.$store.state?.ME.data,
        q: 'get_classes_groups',
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
    SelectedImage(itm){
      console.log(itm);
    },
    isMentor(){
      return this.$store.state?.ME.data?.user_type == 'admin' || this.$store.state?.ME.data?.user_type == 'mentor';
    },
    CreateGroup() {
      if (this.newGroup.name.trim().length > 1) {
        let obj = {
          q: "create_group",
          me: this.$store.state.ME.data,
          name: this.newGroup.name,
          description: this.newGroup.description,
        };
        this.axios.post(this.apiurl, obj).then((itm) => {
          console.log(itm.data);
          if (itm.data?.data) {
            this.$router.push(`/group/${itm.data.data}`);
            this.isWindowCreateGroup = false;
            this.newGroup.name = "";
            this.newGroup.description = "";
          }else{
            this.$error("Ошибка создания группы", itm.data?.error ?? "Неизвестная ошибка");
          }
        }).catch(()=>{
          this.$error("Ошибка создания группы", "Ошибка с соединением");
        })
      }
    },

    JoinGroup() {
      if(this.isJoinLoading) return;
      this.isJoinLoading = true;
      let obj = {
        q: "join_group",
        me: this.$store.state.ME.data,
        join_code: this.joinCode,
      };
      this.axios.post(this.apiurl, obj).then((itm) => {
        this.isJoinLoading = false;
        this.joinCode = "";
        console.log(itm.data);
        if (itm.data?.data) {
          this.isWindowJoinGroup = false;
          switch (itm.data.data) {
            case 'ok':
              this.$Notification.success({
            title: itm.data?.message,
            placement: 'bottom-right',
            text: "Ожидайте, пока куратор примит вашу заявку",
          });
              break;
            case 'ok2':
              this.$Notification.warning({
            title: itm.data?.message,
            placement: 'bottom-right',
           
          });
              break;
          }
        }
      });
    },
  },
};
</script>

<style>

.modal-header {
  margin: 3px;
}
</style>