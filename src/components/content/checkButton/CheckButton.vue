<template>
  <div class="check-button" :class="{check: isChecked}">
    <img src="~assets/img/cart/tick.svg" alt="">
  </div>
</template>

<script>
  export default {
    name: "CheckButton",
    props: {
      isChecked: {
        type: Boolean,
        default() {
          return false;
        }
      }
    }
  }
</script>

<style scoped>
  .check-button{
    border-radius: 50%;
    /*background-color: orange;*/
    border: 2px solid #aaa;
  }
  .check{
    border-color: #f00;
    background-color: #f00;
  }
</style>
