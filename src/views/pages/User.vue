<template>
  <Block>
    <div v-if="USER == undefined" class="center-loading">
      <it-loading></it-loading><br />
      <div>Загрузка</div>
    </div>
    <div v-else>
      <div class="user-top-panel" style="height: 0px">
        <span v-if="isMe && USER.social_network == 'def'">
          <p-button icon="pi pi-cog" @click="isEditPassword = true" class="p-button-rounded p-button-secondary p-button-outlined" title="Измнить пароль" />
        </span>
      </div>
      <div class="center">
      <it-avatar :src="USER.avatar" size="100px" />
      <h3>{{ USER.first_name + " " + USER.last_name }}</h3>
      </div>
    </div>
    <div v-if="isMe">
      <it-button block @click="logout">Выход</it-button>
    </div>

    <!-- Смена пароля -->
      <it-modal v-model="isEditPassword">
        <template #header
          ><h3 class="modal-header">Смена пароля</h3></template
        >
        <template #body>
          <it-input v-model="pas.currentPassword" type="password" placeholder="Текущий пароль"/><br />
          <it-input v-model="pas.newPassword" type="password" placeholder="Новый пароль"/>
          <div style="margin-top: 6px">
            <it-input v-model="pas.confirmPassword" type="password" :status="pas.getStatus()" :message="pas.getStatus() == 'danger' ? 'Пароли не совпадают': ''" placeholder="Подтвердите новый пароль"/>
          </div>
        </template>
        <template #actions>
          <it-button @click="isEditPassword = false">Отмена</it-button>
          <it-button :loading="isEditingPassword" @click="EditPassword" type="primary" :disabled="pas.getStatus() != 'success'">Изменить</it-button>
        </template>
      </it-modal>
      <!-- /Смена пароля -->
  </Block>
</template>

<script>
import Block from "../../components/Block"

export default {
  components:{Block},
  data() {
    return {
      isEditPassword: false,
      USER: undefined,
      isEditingPassword: false,
      
      pas:{ 
        currentPassword: '', newPassword: '', confirmPassword: '',
        getStatus: ()=>{
          let ret = 'danger';
          if(this.pas.newPassword == this.pas.confirmPassword) ret = 'success';
          if (this.pas.newPassword == '' || this.pas.confirmPassword == '' ) ret = "";
          return ret;
        },
      }
    };
  },
  computed: {
    isMe(){
      return ((this.USER?.usr_id || -10) == this.$store.state.ME.data?.usr_id);
    },
    usr_id(){
      this.load();
      return this.$route.params.usr_id;
    }
  },
  methods: {
    async EditPassword(){
      this.isEditingPassword = true;
      let obj = {
        q: 'user_edit_password',
        me: this.$store.state?.ME.data,
        currentPassword: this.pas.currentPassword,
        newPassword: this.pas.newPassword,
      }
      await this.axios.post(this.apiurl, obj).then((itm)=>{
        this.isEditingPassword = false;
        if(itm.data?.data){
          this.$success('Пароль изменен', 'Пароль был успешно изменен')
          this.isEditPassword = false;
          this.pas.currentPassword = '';
          this.pas.newPassword = '';
          this.pas.confirmPassword = '';
        }else if(itm.data?.error){
          this.$error('Ошибка смены пароля', itm.data?.error || 'Неизвестная ошибка');
        }
      }).catch(()=>{
        this.isEditingPassword = false;
      })
    },
    async load() {
      let obj = {
        q: "get_user",
        me: this.$store.state?.ME.data,
        data: {
          usr_id: this.$route.params?.usr_id
        },
      };
      await this.axios.post(this.apiurl, obj).then((itm) => {
        console.log(obj, itm.data)
        if (itm.data?.data) {
          this.USER = itm.data.data;
          console.log(this.USER);
        }
      });
    },
    logout(){
      localStorage.clear();
      document.location = "/";
    }
  },
  watch:{
  },
   beforeRouteUpdate(){ 
    setTimeout( ()=> {this.load()}, 0);
  },
  mounted() {
   this.load()
  },
};
</script>



<style scoped>
.user-top-panel{
  display: flex;
  flex-direction: row-reverse;
}
.center{
  text-align: center;
}
</style>