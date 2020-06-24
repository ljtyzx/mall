<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <scroll ref="scroll"
            :probe-type="3"
            :click="true"
            class="scroll">
      <cart-list />
    </scroll>
    <cart-bottom-bar/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/common/bscroll/BetterScroll'

  import CartList from './childComps/CartList'
  import CartBottomBar from './childComps/CartBottomBar'

  import {mapGetters} from 'vuex'

  export default {
    name: "Cart",
    components: {
      NavBar,
      Scroll,
      CartList,
      CartBottomBar
    },
    computed: {
      // ...mapGetters(['cartLength','cartList'])
      ...mapGetters({
        length: 'cartLength',
        list: 'cartList'
      })
    },
    activated() {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart{
    height: 100vh;
    /*position: relative;*/
  }
  .nav-bar{
    position: relative;
    color: #fff;
    /*font-weight: 700;*/
    z-index: 9;
    background-color: var(--color-tint);
  }

  .scroll{
    height: calc(100vh - 44px - 89px);
  }
</style>
