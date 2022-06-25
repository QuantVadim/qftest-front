<template>
  <div class="navigator">
    <it-button-group vertical>
          <it-button block @click="goRoute('/')">Главная</it-button>
          <it-button v-if="isMentor()" block @click="goRoute('/mytests')">Мои тесты</it-button>
          <it-button block @click="goRoute('/myresults')">Мои решения</it-button>
          <it-button block @click="goRoute('/groups')">Группы</it-button>
          <it-button v-if="isMentor()" block @click="goRoute('/test/new/editor')">Создать тест</it-button>
        </it-button-group>
        <div v-if="$store.state?.ME.data?.user_type == 'admin'">
          <br>
          <it-button block @click="goRoute('/admin')">Администрирование</it-button>
        </div>
        <footer class='footer'>
          <div>
            Продолжая пользоваться сайтом, вы принимаете
            <a target="_blank" href="/docs/?q=terms">пользовательское соглашение</a> и 
            <a target="_blank" href="/docs/?q=privacy">политику обработки персональных данных</a>.<br>
            <a target="_blank" href="/docs/?q=about">Основные сведения</a>
          </div>
          <div style="margin-top: 6px">МБОУ "СОШ №1"© 2022</div>
        </footer>
        
  </div>
</template>

<script>
export default {
  methods:{
    goRoute(route) {
      this.$router.push(route);
      this.$emit('on-clicked');
    },
    isMentor(){
      return this.$store.state?.ME.data?.user_type == 'admin' || this.$store.state?.ME.data?.user_type == 'mentor';
    },
  }
}
</script>

<style>
.navigator
.it-btn-text {
    height: 20px !important;
    font-size: 14px !important;
    line-height: 24px !important;
}
footer.footer{
  text-align: center;
  color: gray;
  font-size: 11px;
  margin-top: 20px;
}
footer.footer a{
  color: gray;
}
</style>