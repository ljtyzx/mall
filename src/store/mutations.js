import {
  ADD_COUNTER,
  ADD_TO_CART,
  CHANGE_CHECKED
} from './mutations-types'

export default {
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state,payload) {
    payload.checked = true;
    state.cartLists.push(payload);
  },
  [CHANGE_CHECKED](state,payload) {
    state.cartLists[payload].checked = !state.cartLists[payload].checked;
  }
}
