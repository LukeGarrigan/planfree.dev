import Player from '@/view-models/player'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface RootState {
  players: Player[];
  socket: any;
}

export const state: RootState = {
  players: [],
  socket: {}
}

export default new Vuex.Store<RootState>({
  state,
  mutations: {
    setSocket(state, socket) {
      state.socket = socket;
    }
  },
  actions: {
  },
  modules: {
  }
})
