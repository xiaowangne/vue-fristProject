import Vue from 'vue'
import Vuex from 'vuex'

import {menuModule} from './menuStore/modules'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    identifyCode: '',
    // 订单标签激活
    activeOrder:0,
  },
  mutations:{
    changeCode(state,code){
      state.identifyCode=code;
    },
    changeData(state,data){
      state[data.key]=data.value;
    },
  },
  modules:{
    menuModule
  }
})
