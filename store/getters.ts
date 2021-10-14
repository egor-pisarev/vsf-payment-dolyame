import { DolyameState } from '../types/DolyameState'
import { GetterTree } from 'vuex'

export const getters: GetterTree<DolyameState, any> = {
  getInfo: state => state.info
}
