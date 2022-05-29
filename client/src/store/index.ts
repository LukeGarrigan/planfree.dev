import Player from '@/view-models/player'
import Vuex from 'vuex'

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
