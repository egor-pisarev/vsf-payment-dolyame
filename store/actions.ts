import { DolyameState } from '../types/DolyameState'
import { ActionTree } from 'vuex'
import config from 'config'
import { processURLAddress } from '@vue-storefront/core/helpers'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import * as types from './mutation-types'

export const actions: ActionTree<DolyameState, any> = {

  async create({ commit, getters, dispatch, rootState }, { amount, cartId, items }) {
    const createUrl = processURLAddress(config.dolyame.endpoint.create)

    commit(types.SET_DOLYAME_DATA, { amount, cartId, items })

    return TaskQueue.execute({
      url: createUrl,
      payload: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify({ amount, cartId, items })
      }
    }).then(task => {
      if (task.result.success) {
        commit(types.SET_DOLYAME_INFO, task.result.result)
      }
      return task
    }).catch(err => {
      console.log('Error token get', err)
    })
  },
  async info({ commit, getters, dispatch, rootState }, { cartId }) {
    const url = processURLAddress(`${config.dolyame.endpoint.info}/${cartId}`)

    return TaskQueue.execute({
      url,
      payload: {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      }
    }).then(task => {
      if (task.result.success) {
        commit(types.SET_DOLYAME_INFO, task.result.result)
      }
      return task
    }).catch(err => {
      console.log('Error token get', err)
    })
  },
  async commit({ commit, getters, dispatch, rootState, state }) {
    const url = processURLAddress(config.dolyame.endpoint.commit)

    return TaskQueue.execute({
      url,
      payload: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(state.info)
      }
    }).then(task => {
      if (task.result.success) {
        commit(types.SET_DOLYAME_INFO, task.result.result)
      }
      return task
    }).catch(err => {
      console.log('Error token get', err)
    })
  },
}
