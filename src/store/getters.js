export default {
  cartLength(state) {
    return state.cartLists.reduce((total, currentValue) => {
      return total + currentValue.count
    },0);
  },
  cartList(state) {
    return state.cartLists;
  },
  isCheckAll(state) {
    return !!state.cartLists.length && !(state.cartLists.find(item => !item.checked))
  }
}
