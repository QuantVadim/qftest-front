import { createStore } from 'vuex'

import ME from './modules/me'
import conf from '@/conf'

const CONSTANS = {
  api: conf.API,
}

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters:{
    const(){return CONSTANS}
  },
  modules: {
    ME
  }
})
