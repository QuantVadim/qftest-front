<template>
<div :class="{'wide-content-mode': IsWideContent}">
  <header>
    <div class="header-content main-center">
      <div class="btn-sidebar-menu">
        <it-icon @click="menuIsActive = true" color="white" name="menu" />
      </div>
      <div></div>
      <div>
        <div v-if="MYID" class="header_user_info" @click="goRoute(mainProfile)">
          {{ $store.state.ME.data.first_name }}
          <it-avatar size="36px" :src="$store.state.ME.data.avatar" />
        </div>
        <div class="h-vk-enter" v-else>
          <it-button outlined text class="h-enter-vk" @click="enterVK"
            >Вход</it-button
          >
        </div>
      </div>
    </div>
  </header>
  <div class="main-grid-center">
    <div class="_part _left">
      <div class="main-logo"><img src="/img/logo1.png" height="30" alt=""><span>МБОУ "СОШ №1"</span></div>
      <div><Navigat /></div>
    </div>
    <main class="main">
      <!-- <keep-alive>
        <router-view :key="$route.path" class="enter-show" />
      </keep-alive> -->
      
  <router-view v-slot="{ Component }" class="enter-show">
    <div>
      <keep-alive :max="2">
        <component v-if="isKeepAlive"  :is="Component" :key="$route.path" />
      </keep-alive>
    </div>
    <div v-if="!isKeepAlive">
      <component :is="Component" :key="$route.path" />
    </div>
    
  </router-view>
    <NavigatorBottom v-if="!IsWideContent" />
    </main>
    <div class="_part"></div>
  </div>
  <Sidebar v-model:visible="menuIsActive" class="p-sidebar-sm">
    <h3 class="h3-title">Меню</h3>
    <Navigat @click="menuIsActive = false" />
  </Sidebar>
  <it-modal >
    <template #body>
      Ок
    </template>
  </it-modal>
</div>
<!-- Выбор изображения: -->
    <it-modal v-if="ImageSelector" v-model="ImageSelector.$.isOpen">
      <template #header>
        <h3 style="margin: 0px">Выбор изображения</h3>
      </template>
      <template #body>
        <ImageSelectorGlob @select="ImageSelector.$.onSelected" @close="ImageSelector.Close()" />
      </template>
      <template #actions>
        <it-button @click="ImageSelector.Close()">Закрыть</it-button>
        <!-- <it-button :loading="isDeletingGTest" @click="DeleteGTest" type="danger">Удалить</it-button> -->
      </template>
    </it-modal>
</template>

<script>
import ImageSelectorGlob from "@/components/Menus/ImageSelector";
import NavigatorBottom from "@/components/NavigatorBottom.vue";
import Navigat from "../../components/Navigat.vue";
import Sidebar from "primevue/sidebar";
import conf from "@/conf.js";
import {provide, reactive } from '@vue/runtime-core';

export default {
  components: {
    Sidebar,
    Navigat,
    NavigatorBottom,
    ImageSelectorGlob,
  },
  setup(){
    const ImageSelector = reactive({
        $:{
          isOpen: false,
          onSelected: ()=>{},
        },
        Open(method){ 
          this.$.isOpen = true; 
          if(method){this.$.onSelected = method} 
        },
        Close(){ this.$.isOpen = false; this.$.onSelected = ()=>{} },
    });
    provide('ImageSelector', ImageSelector);
    return{
      ImageSelector
    }
  },
  data() {
    return {
      Main: undefined,
      keepAlives: ['Group', 'Groups', 'MyTests', 'MyResults', 'Home', 'GroupTestBasic', 'TestBasic', 'TestResult', 'TestEditor'],
      IsWideContent: false,

      NecessarilyUser: ["MyTests"],
      menuIsActive: false,
      isActive: true,
      
      isWindowImageSelector: false,
    };
  },
  computed: {
    isKeepAlive(){
      for(let i = 0; i < this.keepAlives.length; i++){
        if(this.$route.name == this.keepAlives[i]){
          return true;
        }
      }
      return false;
    },
    stt(){
      return window.history.state;
    },
    mainProfile() {
      return "/user/" + this.$store.state.ME.data.usr_id;
    },
    MYID() {
      return this.$store.getters.MYID;
    },
  },
  
  mounted(){
    this.Main = document.querySelector('.main');
    this.UpdateWidePage()
    //Наблюдение за Изменением пути:
    this.$watch( ()=>this.$route.path, ()=>{
      this.UpdateWidePage()
    })
  },
  methods: {
    UpdateWidePage(){
      let isWideContent = false;
      for (let i = 0; i < conf.WidePages.length; i++) {
        if(this.$route.path.indexOf(conf.WidePages[i]) == 0){
          isWideContent = true; break;
        }
      }
      this.IsWideContent = isWideContent;
    },
    goRoute(route) {
      this.$router.push(route);
      this.menuIsActive = false;
    },
    enterVK() {
      document.location = conf.VK_AUTH_URL;
    },
  },
};
</script>


<style scoped>
  .main-center {
    margin: auto;
    max-width: 600px;
    transition: 0.2s all;
  }
  .wide-content-mode .main-center {
    margin: auto;
    max-width: 700px;
  }
</style>