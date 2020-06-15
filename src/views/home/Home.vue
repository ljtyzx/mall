<template>
  <div id="home">
    <nav-bar class="home-nav">
      <span slot="center">购物街</span>
    </nav-bar>
    <b-scroll :probe-type="3" :pull-up-load="true" :click="true" @pullingUp="loadMore" @scroll="scroll" class="content" ref="bscroll">
      <home-swiper :banners="banners"/>
      <recommend-view :recommends="recommends"/>
      <feature-view />
      <tab-control @tabClick="tabClick" class="tab-control" :titles="['流行','新款','精选']"/>
      <goods-list :goods="showGoods"></goods-list>
    </b-scroll>
    <back-top v-show="showBackTop" @click.native="backClick"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import BScroll from 'components/common/bscroll/BetterScroll'
  import BackTop from 'components/content/backTop/BackTop'

  import {getHomeMultidata,getHomeGoods} from 'network/home'

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,

      NavBar,
      TabControl,
      GoodsList,
      BScroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        showBackTop: false
      }
    },
    created() {
      this.getHomeMultidata();

      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');

    },
    mounted() {
      this.refresh();
    },
    methods: {
      /**
       * 事件监听相关方法
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell';
            break;
        }
      },
      scroll(position) {
        this.showBackTop = position.y < -1000
      },

      loadMore() {
        this.getHomeGoods(this.currentType);
      },

      backClick() {
        this.$refs.bscroll.scrollTo(0,0,500)
      },

      refresh() {
        this.$bus.$on('itemImgLoad',() => {
          console.log(this);
          this.$refs.bscroll.refresh();
        })
      },

      /**
       * 网络请求相关方法
       */
      getHomeMultidata() {
        // 1.请求多个数据
        getHomeMultidata().then(res => {
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
          // this.dKeywords = res.data.dKeyword.list;
          // this.keywords = res.data.keywords.list;
        }).catch(err => {
          console.log(err);
        })
      },

      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        // 2.请求商品数据
        getHomeGoods(type, page).then(res => {
          // console.log('请求数据被调用');
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1
        })
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      },
      // getIsShow() {
      //   return
      // }
    }
  }
</script>

<style scoped>
  #home{
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control{
    position: sticky;
    top: 44px;
    background-color: #fff;
    z-index: 9;
  }

  .content{
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /*.content{*/
  /*  height: calc(100% - 93px);*/
  /*  margin-top: 44px;*/
  /*  overflow: hidden;*/
  /*}*/


</style>
