<template>
  <div class="bottom-bar">
    <div class="check-all">
      <check-button @click.native="checkAll" :is-checked="isCheckAll" class="check-button"/>
      全选
    </div>

    <div>
      合计：{{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'

  import {mapGetters} from 'vuex'

  export default {
    name: "CartBottomBar",
    data() {
      return {

      }
    },
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters({
        length: 'cartLength',
        cartList: 'cartList',
        isCheckAll: 'isCheckAll'
      }),
      totalPrice() {

        return '￥' + this.cartList.filter(item => item.checked)
          .reduce((total, currentValue) => {
          return total + currentValue.price * currentValue.count
        },0).toFixed(2)
        // let total = 0;
        // for (let i in this.cartList) {
        //   console.log(i.checked);
        //   if (this.cartList[i].checked === true) {
        //     total += this.cartList[i].count*this.cartList[i].price
        //   }
        // }
        // return total;
      },

      checkLength() {
        return this.cartList.filter(item => item.checked)
          .reduce((total, currentValue) => {
            return total + currentValue.count
          },0)
      },
      checkNotAll() {
        return !!this.cartList.find(item => item.checked)
      }
    },
    methods: {
      checkAll() {
        if (this.isCheckAll) {
          this.cartList.map((item,index) => {
            this.$store.commit('change_checked',index)
          })
        }else {
          this.cartList.map((item,index) => {
            if (!item.checked) {
              this.$store.commit('change_checked',index)
            }
          })
        }
      },
      calcClick() {
        if (!this.checkNotAll) {
          this.$toast.show('请选择购买的商品', 1500)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar{
    display: flex;
    height: 40px;
    justify-content: space-between;
    background-color: #eee;
    /*z-index: 9;*/
    position: relative;
    bottom: 49px;
    line-height: 40px;
    font-size: 14px;
  }

  .check-all{
    display: flex;
    align-items: center;
    margin: 0 15px 0 10px;
    /*justify-content: center;*/
  }
  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .calculate{
    padding: 0 20px;
    color: #fff;
    background-color: orange;
  }
</style>
