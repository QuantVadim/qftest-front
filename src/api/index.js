import conf from "@/conf";
import store from '@/store';

export default {
  install: (app) => {
    app.config.globalProperties.API = conf.API;
    app.config.globalProperties.apiurl = conf.API;
    app.config.globalProperties.conf = conf;
    app.config.globalProperties.me = store.state.ME.data;
    app.config.globalProperties.getUser = 
      function(){return {usr_id: localStorage.getItem('usr_id'), mykey: localStorage.getItem('mykey')}};
  }
}

export function getUser(){
  return {usr_id: localStorage.getItem('usr_id'), mykey: localStorage.getItem('mykey')}
}