<template>
  <div>
    <div v-if="$store.state?.ME.data?.user_type == 'admin' || $store.state?.ME.data?.user_type == 'mentor'">
    <header>
      <div class="header-content main-center">
        <div class="header-label">
            <div><p-button @click="goRoute('/')" icon="pi pi-arrow-left" class="p-button-secondary p-button-rounded p-button-text" style="color: white; margin-top: 3px" /></div>
            <div class="admin-label">Администрирование</div>
        </div>
        <div></div>
        <div>
          <div
            v-if="$store.state.ME.data?.usr_id"
            class="header_user_info"
            @click="goRoute(mainProfile)"
          >
            {{ $store.state.ME.data.first_name }}
            <it-avatar size="36px" :src="$store.state.ME.data.avatar" />
          </div>
          <div class="h-vk-enter" v-else>
            <it-button outlined text class="h-enter-vk">Вход</it-button>
          </div>
        </div>
      </div>
    </header>
    <main class="main">
    <aside class="aside-left">
    <NavigatBar/>
    </aside>
    <div class="page-body">
        <div class="page-content-wrapper">
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
        </div>
    </div>
    </main>
  </div>
  <div v-else>
    <header>
      <div class="header-content main-center">
        <div class="header-label">
            <div><p-button @click="goRoute('/')" icon="pi pi-arrow-left" class="p-button-secondary p-button-rounded p-button-text" style="color: white; margin-top: 3px" /></div>
            <div class="admin-label"></div>
        </div>
        <div></div>
        <div>
          <div
            class="header_user_info"
            @click="goRoute(mainProfile)"
          >
            {{ $store.state.ME.data.first_name }}
            <it-avatar size="36px" :src="$store.state.ME.data.avatar" />
          </div>
        </div>
      </div>
    </header>
    <div class="error-message-box" style="text-align: center;">
        <block><i class="pi pi-times" style="font-size: 2rem"></i> <br> Отказано в доступе</block>
    </div>
  </div>
    <UserEditor :active='UserEditor.active' :data='UserEditor.data' @close="CloseEditor('UserEditor')" />
    <AccountEditor :active='AccountEditor.active' :data='AccountEditor.data' @close="CloseEditor('AccountEditor')" />
    <CommunityEditor :active='CommunityEditor.active' :data='CommunityEditor.data' @close="CloseEditor('CommunityEditor')" />
    <GroupEditor :active='GroupEditor.active' :data='GroupEditor.data' @close="CloseEditor('GroupEditor')" />
  </div>
</template>

<script>
import EventBus from '@/EventBus.js';
import NavigatBar from "@/admin/units/NavigatBarAdmin";

import UserEditor from '@/admin/components/UserEditor.vue';
import AccountEditor from '@/admin/components/AccountEditor.vue';
import CommunityEditor from '@/admin/components/CommunityEditor.vue';
import GroupEditor from '@/admin/components/GroupEditor.vue';

export default {
    components: {
        NavigatBar,
        UserEditor, AccountEditor, CommunityEditor, GroupEditor
    },
    provide(){
        return{
            
        }
    },
    created(){
        EventBus.$on('UserEditor', itm=>{
            console.log(itm);
            switch (itm?.name) {
                case 'open': this.UserEditor.data = itm?.data;
                    this.UserEditor.active = true; break;
                case 'onSave': this.UserEditor.active = false; break;
                case 'onDeleted': this.UserEditor.active = false; break;
            }
        });
        EventBus.$on('AccountEditor', itm=>{
            console.log(itm);
            switch (itm?.name) {
                case 'open': this.AccountEditor.data = itm?.data;
                    this.AccountEditor.active = true; break;
                case 'onSave': this.AccountEditor.active = false; break;
                case 'onCreated': this.AccountEditor.active = false; break;
                case 'onDeleted': this.AccountEditor.active = false; break;
            }
        });
        EventBus.$on('CommunityEditor', itm=>{
            console.log(itm);
            switch (itm?.name) {
                case 'open': this.CommunityEditor.data = itm?.data;
                    this.CommunityEditor.active = true; break;
                case 'onSave': this.CommunityEditor.active = false; break;
                case 'onCreated': this.CommunityEditor.active = false; break;
                case 'onDeleted': this.CommunityEditor.active = false; break;
            }
        });
        EventBus.$on('GroupEditor', itm=>{
            console.log(itm);
            switch (itm?.name) {
                case 'open': this.GroupEditor.data = itm?.data;
                    this.GroupEditor.active = true; break;
                case 'onSave': this.GroupEditor.active = false; break;
                case 'onCreated': this.GroupEditor.active = false; break;
                case 'onDeleted': this.GroupEditor.active = false; break;
            }
        });
    },
    unmounted(){
        EventBus.$off('UserEditor');
        EventBus.$off('AccountEditor');
        EventBus.$off('CommunityEditor');
        EventBus.$off('GroupEditor');
    },
    data(){
        return{
            isKeepAlive: true,
            UserEditor: { active: false, data: null},
            AccountEditor: {active: false, data: null},
            CommunityEditor: {active: false, data: null},
            GroupEditor: {active: false, data: null},
        }
    },
    computed:{
        mainProfile() {
            return "/user/" + this.$store.state.ME.data.usr_id;
        },
    },
    methods:{
        goRoute(route) {
            this.$router.push(route);
            this.menuIsActive = false;
        },
        CloseEditor(name){
            if(this?.[name]){
                this[name].active = false;
            }
        }
    }
};
</script>

<style scoped>
.error-message-box{
    margin: auto;
    max-width: 400px;
    margin-top: 52px;
    color: rgb(201, 45, 45);
}
.error-message-box .block{
    padding: 30px;
}
.error-message-box i{
    border: 2px solid rgb(201, 45, 45);
    padding: 6px;
    margin-bottom: 8px;
    border-radius: 160%;
}

header{
    width: 100%;
    min-width: 400px;
    position: fixed;
    top: 0px;
    left: 0px;
}
.admin-label{
    font-size: 16px;
    line-height: 42px;
    color: white;
    padding-left: 8px;
}
.header-label{
    display: flex;
}
aside.aside-left{
    width: 250px;
    top: 42px !important;
    position: sticky;
    background-color: rgb(54 75 117);
    height: calc( 100vh - 42px );
}

main.main{
    margin-top: 42px;
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    padding: 0px;
    max-width: 100vw;
}
.main .page-body{
    display: block;
    width: 100%;
    margin-top: 4px;
    margin-left: auto;
    margin-right: auto;
}
.page-content-wrapper{
    width: 100%;
    max-width: 1100px;
    min-width: 600px;
    display: block;
    margin: auto;
    height: 1110px;
}

</style>