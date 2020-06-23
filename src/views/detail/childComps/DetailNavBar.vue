<template>
  <nav-bar>
    <div slot="left" class="left" @click="backClick">
      <img src="~assets/img//common/back.svg" alt="">
    </div>
    <div slot="center" class="center">
      <div v-for="(item, index) in titles"
           class="title-item"
           :class="{active: index===currentIndex}"
           @click="detailClick(index)">
        {{item}}
      </div>
    </div>
    <div slot="right">
      
    </div>
  </nav-bar>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'

  export default {
    name: "DetailNavBar",
    components: {
      NavBar
    },
    data() {
      return {
        titles: ['商品','参数','评论','推荐'],
        currentIndex: 0
      }
    },
    methods: {
      detailClick(index) {
        this.currentIndex = index;
      },
      backClick() {
        // this.$router.back()
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
  .left{
    padding-left: 5px;
  }
  .left img{
    vertical-align: middle;
  }
  .center{
    display: flex;
  }
  .title-item{
    flex: 1;
  }
  .active{
    color: var(--color-high-text);
  }
</style>
