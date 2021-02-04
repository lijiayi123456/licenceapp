import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userAccessToken: '',
    userInfo: '',
  },
  mutations: {
    setUserAccessToken(state,userAccessToken) {
      state.userAccessToken = userAccessToken;
    },
    setUserInfo(state,userInfo) {
      state.userInfo = userInfo;
    }
  },
  actions: {
  },
  modules: {
  }
})
