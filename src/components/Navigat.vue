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
</style>