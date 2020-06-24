<template>
  <div class="cart-list">
    <cart-list-item v-for="(item,index) in cartList"
                    :key="index"
                    :product="item"
                    :index="index" />
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import CartListItem from './CartListItem'
  export default {
    name: "CartList",
    components: {
      CartListItem
    },
    computed:{
      ...mapGetters({
        cartList: 'cartList'
      })
    }
  }
</script>

<style scoped>

</style>
