<template>
<div v-if="isReady">
  <component v-if="$store.state.ME.data?.usr_id || layout == 'empty-layout'" :is="layout"></component>
  <div v-else-if="isUserLoading && !$store.state.ME.data?.usr_id">
    <div class="center"><it-loading/></div>
  </div>
  <div v-else>
    <div class='login-body'>
      <div class='login-logo'>
        МБОУ "СОШ №1": Тестирование
      </div>
      <block class="center window-login">
        <LoginForm />
      </block>
    </div>
    <footer class="site-footer">
      <div>
        <div>Адрес:</div>
        352360, Краснодарский край, Тбилисский район, станица Тбилисская, улица Первомайская, 40</div>
      <div style="text-align:center">
        <div>
            <a target="_blank" href="/docs/?q=about">Основные сведения</a><br>
            <a target="_blank" href="/docs/?q=terms">Пользовательское соглашение</a> и 
            <a target="_blank" href="/docs/?q=privacy">политика обработки персональных данных</a>.
          </div>
          <div style="margin-top: 6px">МБОУ "СОШ №1"© 2022</div>
      </div>
      <div style="text-align:right">
        <div>Контакты:</div>
        <a href="tel:+78615832883">8(86158)3-28-83</a><br>
        <a href="mailto:school1@tbl.kubannet.ru">school1@tbl.kubannet.ru</a>
        <div>Техническая поддержка:</div>
        <a href="mailto:vkuralin@vk.com">vkuralin@vk.com</a>
      </div>
    </footer>
  </div>
</div>
</template>

<script>
import EmptyLayout from './views/layouts/EmptyLayout';
import MainLayout from './views/layouts/MainLayout';
import AdminLayout from './views/layouts/AdminLayout';
import Block from './components/Block';
import LoginForm from '@/components/Units/LoginForm';

export default {
  components:{
    EmptyLayout, MainLayout, AdminLayout, Block, LoginForm
  },
  computed:{
    layout(){
      return (this.$route.meta?.layout || 'empty')+'-layout';
    }
  },
  data(){
    return{
      isReady: false,
      isUserLoading: true,
    }
  },
  async beforeCreate(){
    await this.$store.dispatch('LOAD_USER');
    this.isUserLoading = false;
  },
  created(){
    this.isReady = true;
  },
  methods:{
   // ...mapActions(['LOAD_USER']),
   
  }
}
</script>

<style>
@import '~primeicons/primeicons.css';
@import '~primevue/resources/primevue.min.css';
@import '~primevue/resources/themes/saga-blue/theme.css';

.login-body{
  height: 100vh;
}
footer.site-footer{
  background-color: rgba(0, 0, 0, 0.4);
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr minmax(100px, 400px) 1fr;
  color: gray;
  justify-content: space-between;
  font-size: 12px;
}
footer.site-footer a{
  color: gray;
}


*{
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
pre{
  white-space:pre-wrap;
    font-family: Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 14px;
}

@keyframes _show{
  from{
    opacity: 0;
    transform: translateY( 100px );
  }
  to{
    opacity: 1;
    transform: translateY( 0px );
  }
}
._show{
  animation: _show cubic-bezier(0, 0, 0, 1.3) 0.6s;
}

.it-toggle:focus{
  box-shadow: none !important;
}
.gray{
  color: gray;
}
.window-login{
  width: 300px;
  margin: auto;
  margin-top: 60px;
}
.center{
  text-align: center;
}
body{
  padding: 0px;
  margin: 0px;
  background-color: rgb(206, 206, 206);
}
#app {
  font-family: Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif;
  -webkit-font-smoothing: antialiased;

}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.login-logo{
    color: white;
    text-align: center;
    margin-top: 30px;
    font-size: 20px;
}
</style>
