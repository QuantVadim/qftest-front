<template>
  <div v-if="error == false">
    <div v-if="group != undefined && group?.closed == 0" @mousedown="saveScroll">
      <it-toggle
        v-if="this.group.usr_id == this.$store.state.ME.data.usr_id"
        v-model="tab"
        :options="['Группа', 'Администрирование']"
      />
      <div v-if="tab == 'Группа'">
        <block style="margin-top: 60px">
          <div style="color: gray; margin-left: 6px; display: flex; justify-content: space-between;">
            <span>
              {{ group.count_users }} ч.
            </span>
            <span style="height: 10px">
              <it-button v-if="group?.req_id != undefined && group?.mem_id == undefined" text @click="isModalExitGroup = true">Выйти</it-button>
            </span>
          </div>
          <div class="group-header-image-wrapper">
            <div class="group-image-wrapper-center">
              <it-avatar
                title="Изображение группы"
                class="test-ico-full"
                :style="
                  this.group.usr_id == this.$store.state.ME.data.usr_id
                    ? 'cursor: pointer;'
                    : ''
                "
                size="120px"
                :src="group?.ico_url"
                :text="group.name"
                @click="
                  this.group.usr_id == this.$store.state.ME.data.usr_id
                    ? (isImageSelector = true)
                    : ''
                "
              />
              <it-button
                v-if="this.group.usr_id == this.$store.state.ME.data.usr_id"
                title="Изменить название и описание"
                class="btn-edit-group"
                icon="edit"
                @click="isWindowEditDescription = true"
                size="big"
                round
              ></it-button>
            </div>
          </div>
          <div>
            <h3 style="margin: 8px 0px; text-align: center">
              {{ group.name }}
            </h3>
            <pre v-if="group.description">{{ group.description }}</pre>
          </div>
        </block>
        <block>
          <GTestsLIst ref="gTestList" :data="cashTests" @cash="toCashTests" />
        </block>
      </div>
      <div v-if="tab == 'Администрирование'">
        <block>
          <Accordion :multiple="true">
            <AccordionTab header="Вход в группу">
              <it-checkbox
                @click="SwitchJoinGroup"
                :disabled="isWaitJoinGroup"
                :type="'primary'"
                :label="'Вход в группу'"
                v-model="isJoinGroup"
              />
              <div v-if="isJoinGroup && group.join_key.length > 1">
                <it-input prefix="Код" v-model="join_code" readonly />
                <!-- <it-input prefix="Ссылка" v-model="join_link" readonly /> -->
              </div>
              <div style="margin-top: 10px">
                <it-checkbox
                @click="SwitchPrivateGroup"
                :disabled="isWaitPrivateGroup"
                :type="'primary'"
                :label="'Приватная группа'"
                v-model="isPrivateGroup"
              />
              </div>
            </AccordionTab>
            <AccordionTab header="Оценивание">
                <Dropdown v-model="selectedAssessment" :options="assessments" optionLabel="label" placeholder="Выбрать..." />
                <AssessmentProps :data="selectedAssessment" @update="assessmentUpdate"/>
                <div style="display: flex; margin-top: 10px;">
                  <p-button label="Сохранить" :loading="isAssessmentSaving" @click="AssessmentSave" class="p-button-outlined p-button-secondary" />
                </div>
            </AccordionTab>
            <AccordionTab header="Другие настройки">
              <p-button class="p-button-danger p-button-outlined" @click="isWindowGroupClose = true" label="Закрыть группу" />
            </AccordionTab>
          </Accordion>
        </block>
        <block>
          <h3>Люди</h3>
          <it-toggle v-model="tabPeople" :options="['Участники', 'Заявки']" />
          <GroupUsers
            @cash="CashItems"
            :data="getCashUsers"
            :gr_id="$route.params.id"
            :accepted="getAccepted(tabPeople)"
            :key="tabPeople"
          />
        </block>
      </div>
    </div>
    <!-- Закрытая группа: -->
    <div v-else-if="group && group?.closed == 1">
      <block style="margin-top: 60px">
          <div style="color: gray; margin-left: 6px">
            {{ group.count_users }} ч.
          </div>
          <div class="group-header-image-wrapper">
            <div class="group-image-wrapper-center">
              <it-avatar
                title="Изображение группы"
                class="test-ico-full"
                :style="
                  this.group.usr_id == this.$store.state.ME.data.usr_id
                    ? 'cursor: pointer;'
                    : ''
                "
                size="120px"
                :src="group?.ico_url"
                :text="group.name"
                @click="
                  this.group.usr_id == this.$store.state.ME.data.usr_id
                    ? (isImageSelector = true)
                    : ''
                "
              />
              <it-button
                v-if="this.group.usr_id == this.$store.state.ME.data.usr_id"
                title="Изменить название и описание"
                class="btn-edit-group"
                icon="edit"
                @click="isWindowEditDescription = true"
                size="big"
                round
              ></it-button>
            </div>
          </div>
          <div>
            <h3 style="margin: 8px 0px; text-align: center">
              {{ group.name }}
            </h3>
            <pre v-if="group.description">{{ group.description }}</pre>
          </div>
          <div class="group-closed-message">Группа закрыта</div>
          <Accordion v-if="this.group.usr_id == this.$store.state.ME.data.usr_id" :multiple="true">
            <AccordionTab header="Действия">
              <div class="p-buttonset" style="display: grid; grid-template-columns: 1fr 1fr">
                <p-button class="p-button-danger" @click="btnDeleteGroup" label="Удалить группу" />
                <p-button class="p-button-success" @click="btnOpenGroup" label="Открыть группу" />
              </div>
            </AccordionTab>
          </Accordion>
          <ConfirmDialog></ConfirmDialog>
        </block>
    </div>
    <!-- Выбор изображения: -->
    <it-modal v-model="isImageSelector">
      <template #header>
        <h3 style="margin: 0px">Выбор изображения</h3>
      </template>
      <template #body>
        <ImageSelector @select="SelectImage" @close="isImageSelector = false" img-type='ico' />
      </template>
      <template #actions>
        <it-button @click="isImageSelector = false">Отмена</it-button>
        <!-- <it-button :loading="isDeletingGTest" @click="DeleteGTest" type="danger">Удалить</it-button> -->
      </template>
    </it-modal>
    <!-- Выход из группы: -->
    <it-modal v-model="isModalExitGroup">
      <template #header>
        <h3 style="margin: 0px">Выход из группы</h3>
      </template>
      <template #body>
        <div style="text-align: center">Вы уверены, что хотите покинуть группу?</div>
      </template>
      <template #actions>
        <it-button @click="isModalExitGroup = false">Отмена</it-button>
        <it-button @click="ExitGroup" type="danger" :loading="isExitingGroup">Выйти</it-button>
        <!-- <it-button :loading="isDeletingGTest" @click="DeleteGTest" type="danger">Удалить</it-button> -->
      </template>
    </it-modal>
    <!-- Изменение названия и описания группы: -->
    <it-modal v-model="isWindowEditDescription">
      <template #header>
        <h3 class="modal-header">Редактирование группы</h3>
      </template>
      <template #body>
        <it-input v-model="editGroupData.name" placeholder="Название группы" /><br />
        <it-textarea
          v-model="editGroupData.description"
          placeholder="Описание группы"
        />
      </template>
      <template #actions>
        <it-button @click="isWindowEditDescription = false">Отмена</it-button>
        <it-button @click="SaveDescriptionGroup" type="primary" :loading="isEditingDescriptionGroup">Сохранить</it-button>
      </template>
    </it-modal>
    <!-- Закрытие группы: -->
    <it-modal v-model="isWindowGroupClose">
      <template #header>
        <h3 class="modal-header" style="margin: 0px">Закрытие группы</h3>
      </template>
      <template #body>
        <b>Вы уверены, что хотите закрыть группу?</b><br><br>
        <div>После закрытия группы:</div>
        <ul style="margin: 3px; padding-left: 18px">
          <li>Вы сможете ее безвозвратно удалить</li>
          <li>Группу возможно будет снова открыть</li>
          <li>Пользователи не смогут получить доступ к группе</li>
        </ul>
      </template>
      <template #actions>
        <it-button @click="CloseGroup(true)" type="danger" outlined :loading="isClosingGroup">Закрыть группу</it-button>
        <it-button @click="isWindowGroupClose = false">Отмена</it-button>
      </template>
    </it-modal>
  </div>
  <div v-else>
      <div v-if='group'>
        <block style="margin-top: 60px">
          <div style="color: gray; margin-left: 6px">
            {{ group.count_users }} ч.
          </div>
          <div class="group-header-image-wrapper">
            <div class="group-image-wrapper-center">
              <it-avatar
                title="Изображение группы"
                class="test-ico-full"
                size="120px"
                :src="group?.ico_url"
                :text="group.name"
              />
            </div>
          </div>
          <div>
            <h3 style="margin: 8px 0px; text-align: center">
              {{ group.name }}
            </h3>
            <div style="display: flex; justify-content: center">
              <p-button v-if="group?.accepted == 0" label="Отозвать заявку" :disabled="isDeletingRequest" @click="DeleteRequest" />
              <p-button v-else label="Вступить" :disabled="isJoinLoading" @click="JoinGroup" />
            </div>
            <pre v-if="group.description">{{ group.description }}</pre>
          </div>
        </block>
      </div>
      <div v-else>
        <block>
        <it-alert
        type="danger"
        :title="'Отказано в доступе'"
        :body="'Группа не существует или вы не состоите в ней'"
        />
        </block>
      </div>
  </div>
</template>

<script>
import conf from "@/conf";

import GroupUsers from "../../components/Lists/GroupUsers.vue";
import GTestsLIst from "../../components/Lists/GTestsList.vue";
import ImageSelector from "@/components/Menus/ImageSelector";

import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import ConfirmDialog from 'primevue/confirmdialog';
import Dropdown from 'primevue/dropdown';

import AssessmentProps from '@/components/SettingsUnits/AssessmentProps'
import {Assessments} from "@/DataLib" //Каталог шкал оценивания

// @ is an alias to /src

export default {
  components: {
    GroupUsers, GTestsLIst, ImageSelector, Accordion, AccordionTab, ConfirmDialog, Dropdown,
    AssessmentProps
  },
  data() {
    return {
      tab: "Группа",
      tabPeople: "Участники",
      isJoinGroup: true,
      isEditingDescriptionGroup: false,
      isClosingGroup: false,
      isWaitJoinGroup: false,
      isAssessmentSaving: false,
      isImageSelector: false,
      isWindowEditDescription: false,
      isWindowGroupClose: false,
      key: "dg",
      error: false,
      cashTests: false,
      cashUsers: [false, false],
      group: undefined,
      editGroupData: {name: '', description: ''},
      result_id: null,

      isPrivateGroup: true,
      isWaitPrivateGroup: false,

      selectedAssessment: undefined,
      assessments: undefined,

      isJoinLoading: false,

      isModalExitGroup: false,
      isExitingGroup: false,

      isDeletingRequest: false,

      ScrollY: 0,
    };
  },
  computed: {
    winResult(){
      return this.$route.query?.result;
    },
    join_link() {
      return (
        window.location.origin +
        "/join/" +
        this.group.gr_id +
        "/" +
        this.group.join_key
      );
    },
    join_code() {
      return this.group.gr_id + "/" + this.group.join_key;
    },
    getCashUsers() {
      let ret;
      switch (this.tabPeople) {
        case "Участники":
          ret = this.cashUsers[0]
          break;
        case "Заявки":
          ret = this.cashUsers[1];
          break;
      }
      return ret;
    },
  },
  watch: {
    group(val){
      if(val != undefined){
        if(val?.assessment && val?.assessment?.name == undefined){
          this.$nextTick(()=>{
            let assess = JSON.parse(val.assessment);
            for (let i = 0; i < this.assessments.length; i++) {
              const el = this.assessments[i];
              if(el.name == assess.name){
                this.assessments[i].body = assess.body;
                this.selectedAssessment = this.assessments[i];
                break;
              }
            }
          })
        }else{
          this.selectedAssessment = this.assessments[0];
        }
      }
    },
    isWindowEditDescription(val){
      if(val){
        this.editGroupData.name = this.group?.name;
        this.editGroupData.description = this.group?.description;
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log(this.$refs['gTestList']);
    if(this.$refs['gTestList']?.isWinResults){
      this.$refs['gTestList'].isWinResults = false;
      next(false);
      return;
    }
    next(true)
  },
  activated(){
    this.$emit('activated');
  },
  mounted() {
    this.GroupLoad();
  },
  created(){
    this.assessments = JSON.parse(JSON.stringify(Assessments));
  },
  methods: {
    DeleteRequest(){
      if(this.isDeletingRequest) return;
      this.isDeletingRequest = true;
      let obj = {
        q: "group_request_delete",
        me: this.$store.state.ME.data,
        gr_id: this.group.gr_id,
      };
      this.axios.post(this.apiurl, obj).then((itm) => {
        this.isDeletingRequest = false;
        if (itm.data?.data) {
          if(itm.data?.data == 'ok'){
            this.GroupLoad();
          }
        }
      });
    },
    ExitGroup(){
      if(this.isExitingGroup) return;
      this.isExitingGroup = true;
      let obj = {
        q: "group_request_delete",
        me: this.$store.state.ME.data,
        gr_id: this.group.gr_id,
      };
      this.axios.post(this.apiurl, obj).then((itm) => {
        this.isExitingGroup = false;
        if (itm.data?.data) {
          if(itm.data?.data == 'ok'){
            this.GroupLoad();
            this.isModalExitGroup = false;
          }
        }
      });
    },
    JoinGroup() {
      if(this.isJoinLoading) return;
      this.isJoinLoading = true;
      let obj = {
        q: "join_group",
        me: this.$store.state.ME.data,
        gr_id: this.group.gr_id,
      };
      this.axios.post(this.apiurl, obj).then((itm) => {
        this.isJoinLoading = false;
        if (itm.data?.data) {
          if(itm.data?.data == 'ok'){
            this.GroupLoad();
          }
        }
      });
    },
    getAccepted(tabName){
      let ret = undefined;
      switch (tabName) {
        case 'Участники':
          ret = true;
          break;
        case 'Заявки':
          ret = false;
          break;
      }
      return ret;
    },
    AssessmentSave(){
      console.log(JSON.stringify(this.selectedAssessment));
      this.isAssessmentSaving = true;
      let obj = {
        me: this.$store.state.ME.data,
        q: 'group_set_assessment',
        gr_id: this.group.gr_id,
        assessment: JSON.stringify(this.selectedAssessment),
      }
      this.axios.post(this.apiurl, obj).then((itm)=>{
        if(itm.data?.data){
          this.$success('Изменение системы оценивания', 'Система оценивания была успешно изменина');
          this.group.assessment = JSON.parse(itm.data?.data);
          this.isAssessmentSaving = false;
        }else{
          this.$error("Ошибка изменения системы оценивания", itm.data?.error || "Неизветсная ошибка")
          console.log(itm.data);
        }
      }).catch(()=>{
        this.$error("Ошибка изменения системы оценивания", "Проблемы с соединением");
      });
    },
    assessmentUpdate(obj){
      for (let i = 0; i < this.assessments.length; i++) {
        const el = this.assessments[i];
        if(el.name == obj.name){
          this.assessments[i].body = obj.body;
          break;
        }
      }
    },
    SelectImage(img){
      let obj = {
        me: this.$store.state.ME.data,
        q: "set_group_ico",
        gr_id: this.group.gr_id,
        img_id: img.img_id,
      }
      this.axios.post(this.apiurl, obj).then((itm)=>{
        if(itm.data?.data){
          this.$success('Изображение изменено', 'Изображение группы было успешно изменено');
          this.group.ico_url = conf.URL+img.url;
        }else{
          this.$error("Ошибка изменения изображения", itm.data?.error || "Неизветсная ошибка")
          console.log(itm.data);
        }
      }).catch(()=>{
        this.$error("Ошибка изменения изображения", "Проблемы с соединением")
      });
      
    },
    SaveDescriptionGroup(){
      this.isEditingDescriptionGroup = true;
      let obj = {
        me: this.$store.state.ME.data,
        q: "set_group_info",
        gr_id: this.group?.gr_id,
        info: this.editGroupData
      }
      this.axios.post(this.apiurl, obj).then((itm)=>{
        this.isEditingDescriptionGroup = false;
        if(itm.data?.data){
          console.log()
          if(itm.data.data == this.group?.gr_id){
            this.group.name = itm.data?.info?.name || this.group.name;
            this.group.description = itm.data?.info?.description;
          }
          this.$success('Измениение группы', 'Название и описание группы успешно изменены');
          this.isWindowEditDescription = false;
        }else{
          this.$error("Ошибка изменения описания группы", itm.data?.error || "Неизветсная ошибка")
        }
      }).catch(()=>{
        this.isEditingDescriptionGroup = false;
         this.$error("Ошибка изменения описания группы", "Проблемы с соединением")
      });
    },
    CloseGroup(val){
      this.isClosingGroup = true;
      let obj = {
        me: this.$store.state.ME.data,
        q: "set_close_group",
        gr_id: this.group?.gr_id,
        value: val
      };
      this.axios.post(this.apiurl, obj).then((itm)=>{
        this.isClosingGroup = false;
        if(itm.data?.data){
          this.isWindowGroupClose = false;
          this.GroupLoad();
        }else{
          if(val)
            this.$error("Ошибка закрытия группы", itm.data?.error || "Неизветсная ошибка")
          else
            this.$error("Ошибка открытия группы", itm.data?.error || "Неизветсная ошибка")
          
          
        }
      }).catch(()=>{
        if(val)
          this.$error("Ошибка закрытия группы", "Проблемы с соединением");
        else
          this.$error("Ошибка открытия группы", "Проблемы с соединением");
      });
    },
    btnOpenGroup(){
      this.$confirm.require({
          message: 'Вы уверены, что хотите открыть группу?',
          header: 'Открытие группы',
          icon: 'pi pi-exclamation-triangle',
          acceptClass: 'p-button-success',
          accept: () => {
              this.CloseGroup(false);
          },
          reject: () => {}
      });
    },
    btnDeleteGroup(){
      this.$confirm.require({
          message: 'Вы уверены, что хотите удалить группу? Восстановить ее будет невозможно',
          header: 'Удаление группы',
          icon: 'pi pi-trash',
          acceptClass: 'p-button-danger',
          accept: () => {
            let obj = {
              me: this.$store.state.ME.data,
              q: "delete_group",
              gr_id: this.group?.gr_id,
            };
            this.axios.post(this.apiurl, obj).then((itm)=>{
              if(itm.data?.data){
                this.GroupLoad();
                this.$success("Удаление группы", "Группа успешно удалена");
              }else{
                this.$error("Удаление группы", itm.data?.error || "Неизветсная ошибка");
              }
            }).catch(()=>{
              this.$error("Удаление группы", "Проблемы с соединением");
            });
          },
          reject: () => {}
      });
    },
    toCashTests(items){
      this.cashTests = items;
    },
    CashItems(items) {
      switch (this.tabPeople) {
        case "Участники":
          this.cashUsers[0] = items
          break;
        case "Заявки":
          this.cashUsers[1] = items;
          break;
      }
    },
    SwitchJoinGroup() {
      setTimeout(() => {
        this.isWaitJoinGroup = true;
        this.group.join_key = "";
        let obj = {
          q: "switch_joining_group",
          me: this.$store.state.ME.data,
          gr_id: this.$route.params.id,
          is_joining: this.isJoinGroup,
        };
        this.axios.post(this.apiurl, obj).then((itm) => {
          console.log(itm.data);
          if (itm.data?.data) {
            this.group.join_key = itm.data.data;
            this.isJoinGroup = itm.data.data.length > 5;
          }
          this.isWaitJoinGroup = false;
        });
      }, 0);
    },
    SwitchPrivateGroup() {
      setTimeout(() => {
        this.isWaitPrivateGroup = true;
        let obj = {
          q: "switch_private_group",
          me: this.$store.state.ME.data,
          gr_id: this.$route.params.id,
          isPrivate: this.isPrivateGroup,
        };
        this.axios.post(this.apiurl, obj).then((itm) => {
          if (itm.data?.data) {
            this.isPrivateGroup = itm.data?.private;
          }
          this.isWaitPrivateGroup = false;
        });
      }, 0);
    },
    GroupLoad() {
      let obj = {
        q: "get_group_info",
        me: this.$store.state.ME.data,
        gr_id: this.$route.params.id,
      };
      this.axios.post(this.apiurl, obj).then((itm) => {
        this.error = false;
        if (itm.data?.data) {
          if(itm.data?.error){
            this.error = itm.data?.error;
          }
          this.group = itm.data.data;
          this.isJoinGroup = itm.data.data.join_key.length > 5;
          this.isPrivateGroup = itm.data.data.private == 1;
        } else if (itm.data?.error) {
          this.error = itm.data?.error;
          this.group = undefined;
        }
      });
    },
  },
};
</script>

<style>
.group-closed-message{
  text-align: center;
  font-size: 20px;
  padding: 16px;
  color: white;
  background-color: #891e1e;
  border-radius: 8px;
  margin-bottom: 8px;
}
.group-header-image-wrapper .it-avatar {
  margin: auto;
  position: relative;
  margin-top: -70px;
  outline: 6px solid white;
  display: block;
}
.btn-edit-group {
  position: relative;
  margin-top: -38px;
  margin-left: 86px;
  height: 38px;
  width: 38px;
  outline: 4px solid white;
}
.btn-edit-group i {
  width: 38px;
  height: 38px;
  font-size: 20px !important;
  line-height: 38px;
  opacity: 0.6;
}
.group-image-wrapper-center {
  width: fit-content;
  margin: auto;
}
.win-result.p-sidebar {
  z-index: 9999999 !important;
}
.win-result.p-sidebar {
  height: 100vh !important;
  background-color: rgb(206, 206, 206);
}
.win-result .p-sidebar-header {
  box-shadow: 0px 8px 8px #cecece;
  z-index: 1;
}
.win-result .sidebar-conent-center {
  max-width: 700px;
  margin: auto;
}
.win-result .p-sidebar-content {
  margin: 0px;
  padding: 0px;
}

</style>