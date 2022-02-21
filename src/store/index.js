import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    hasOpenLobbyGame: false
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    setHasOpenLobbyGame (state, hasOpenLobbyGame) {
      state.hasOpenLobbyGame = hasOpenLobbyGame
    }
  },
  actions: {
  },
  modules: {
  }
})
