import { Module } from 'vuex'
import { DolyameState } from '../types/DolyameState'
import { getters } from './getters'
import { actions } from './actions'
import * as types from './mutation-types'

export const module: Module<DolyameState, any> = {
  state: {
    info: null,
    data: null
  },
  namespaced: true,
  actions,
  getters,
  mutations: {
    [types.SET_DOLYAME_INFO](state, info) {
      state.info = { ...info }
    },
    [types.SET_DOLYAME_DATA](state, data) {
      state.data = { ...data }
    }
  }
}
