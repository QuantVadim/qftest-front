<template>
<div v-if="pg == 'loading'" class="center-loading">
    <it-loading></it-loading><br>
    <div style="color: white">Выполняется вход</div>
</div>
<div v-if="pg == 'binding'">
    <block class="center window-login">
    <div class="login-form">
        <br>
        <it-avatar size="100px" :src="user?.photo" />
        <div style="margin-top: 6px; font-size: 18px">{{ user?.last_name+' '+user?.first_name }}</div><br>
        <div><b>Привязка аккаунта к Вконтакте</b></div>
        <div style="font-size: 14px; margin-top: 6px">Укажите логин и пароль от стандартной учетной записи</div><br>
        <it-input prefix="Логин" v-model="login" @keyup.enter="goToPasswordInput"/>
        <it-input prefix="Пароль" ref="password" type="password" v-model="password" @keyup.enter="isWinBinding = true" />
        <it-button block :type="'primary'" style='height: 41px;' @click="isWinBinding = true">Привязать</it-button>
         <it-divider/>
        <it-button block :type="'primary'" @click="CancelBinding" outlined>Назад</it-button>
    </div>
    </block>
    <!-- Окно подтвержения привязки -->
    <it-modal v-model="isWinBinding">
        <template #header>
            <h3 class="modal-header">Привязка к Вконтакте</h3>
        </template>
        <template #body>
          <div>Вы уверены, что хотите привязать аккаунт к Вконтакте?<br><br>
            После привязки вы сможете войти в аккаунт только через Вконтакте. 
            Войти через логин и пароль будет невозможно.
          </div>
        </template>
        <template #actions>
          <it-button @click="isWinBinding = false">Отмена</it-button>
          <it-button :loading="isBinding" @click="BindAccount" type="primary">Привязать</it-button>
        </template>
      </it-modal>
</div>
</template>

<script scope>
import helpers from '../../others/helpers'
import {mapActions} from 'vuex'


export default{
    data(){
        return{
            link: '',

            login: '',
            password: '',
            pg: 'loading',
            user: null,
            isWinBinding: false,
            isBinding: false,
        }
    },
mounted(){
    let obj = { user_id: helpers.getDataHash('user_id'), access_token: helpers.getDataHash('access_token'), sn: 'vk', };
    if(this.$store.state?.ME.data){
        obj.me = this.$store.state?.ME.data;
    }
    this.axios.post(this.conf.AUTH_URL, obj).then(respon => {
	console.log(respon);
    
	if(!respon.data?.error){
        localStorage.setItem('usr_id', respon.data.usr_id);
        localStorage.setItem('mykey', respon.data.mykey);

        this.LOAD_USER();
        this.$router.push('/');
	}else{
        if(respon.data?.code == 1){
            this.pg = 'binding';
            this.user = respon.data.user;
        }
        this.$error('Ошибка авторизации', respon.data?.error || 'Неизвестная ошибка');
    }
}).catch(itm=>{alert(itm)});
    },
    methods:{
        
        ...mapActions(["LOAD_USER"]),
        goToPasswordInput(){
            this.$refs.password.focus();
        },
        BindAccount(){
            this.isBinding = true;
            let obj = {
                user_id: helpers.getDataHash('user_id'), 
                access_token: helpers.getDataHash('access_token'), 
                sn: 'vk',
                login: this.login,
                password: this.password,
                isBinding: true,
            };
            this.axios.post(this.conf.AUTH_URL, obj).then(respon => {
                this.isBinding = false;
                if(!respon.data?.error){
                    localStorage.setItem('usr_id', respon.data.usr_id); 
                    localStorage.setItem('mykey', respon.data.mykey);
                    this.LOAD_USER();
                    this.$router.replace('/');
                    this.$success('Успешная привязка аккаунта', 'Аккаунт был успешно привязан к Вконтакте');
                }else{
                    this.$error('Ошибка приязки', respon.data?.error || 'Неизвестная ошибка');
                }
            }).catch(()=>{this.isBinding = false;});
        },
        CancelBinding(){
            this.$router.push('/');
        }
    }

}


</script>

<style>
.center-loading{
    text-align: center;
    padding-top: 60px;
}
.login-form .it-input-prefix-wrapper{
  margin-bottom: 6px !important;
}


</style>