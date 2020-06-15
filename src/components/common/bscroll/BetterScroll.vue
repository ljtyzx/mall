<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Better-Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0,
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      },
      click: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null,
      }
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper,{
        pullUpLoad: this.pullUpLoad,
        probeType: this.probeType,
        click: this.click
      });
      this.scroll.on('scroll', position => {
        this.$emit('scroll', position)
      });
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp');
        this.scroll.finishPullUp();
      });
    },
    methods: {
      scrollTo(x, y, time = 300) {
        this.scroll && this.scroll.scrollTo &&this.scroll.scrollTo(x, y, time)
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      }
    }
  }
</script>

<style scoped>

</style>
