<template>
  <div id="home">
    <nav-bar class="home-nav">
      <span slot="center">购物街</span>
    </nav-bar>
    <tab-control ref="tabControl1"
                 @tabClick="tabClick"
                 class="fixed"
                 v-show="isTabFixed"
                 :titles="['流行','新款','精选']"/>
    <b-scroll :probe-type="3"
              :pull-up-load="true"
              :click="true"
              @pullingUp="loadMore"
              @scroll="scroll"
              class="content"
              ref="bscroll">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view />
      <tab-control ref="tabControl2"
                   @tabClick="tabClick"
                   :titles="['流行','新款','精选']"/>
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

  import {debounce} from "common/utils";
  import {backTopMixin} from "common/mixin";

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
        // showBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        scrollY: [0,0,0],
        itemImgListener: null
      }
    },
    created() {
      this.getHomeMultidata();

      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');


    },
    mixins: [backTopMixin],
    mounted() {


    },
    updated() {
      // console.log('updated');
      // const index = this.currentType==='pop'?0:this.currentType==='new'?1:2;
      // this.$refs.bscroll.scrollTo(0,this.scrollY[index],0)
      // let img = document.getElementsByClassName('content')[0].getElementsByTagName('img')

    },
    methods: {
      /**
       * 事件监听相关方法
       */
      tabClick(index) {
        // console.log('$refs   ' + this.$refs.bscroll.scroll.y);

        for (let i = 0; i < this.scrollY.length; i++) {
          if (this.scrollY[i] > -this.tabOffsetTop) {
            this.scrollY[i] = this.$refs.bscroll.scroll.y < -this.tabOffsetTop?-this.tabOffsetTop:this.$refs.bscroll.scroll.y;
          }
        }
        this.scrollY[this.currentType==='pop'?0:this.currentType==='new'?1:2] = this.$refs.bscroll.scroll.y
        // console.log(this.scrollY);
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
        // console.log('scrollY    '+ this.scrollY);
        // console.log('scrollY[index]    '+ this.scrollY[index]);
        // console.log('-------------------------');
        // console.log('before refresh   ' + this.$refs.bscroll.scroll.maxScrollY);

        // console.log('after refresh  ' + this.$refs.bscroll.scroll.maxScrollY);
        this.$nextTick(() => {
          this.$refs.bscroll.refresh();
          this.$refs.bscroll.scrollTo(0,this.scrollY[index],0);
        })
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      scroll(position) {
        this.listenShowBckTop(position);

        this.isTabFixed = position.y < -this.tabOffsetTop
      },

      loadMore() {
        this.getHomeGoods(this.currentType);
      },

      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
        // console.log(this.tabOffsetTop);
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
    activated() {
      // console.log('activated');
      // console.log(this.currentType);
      // console.log(this.scrollY);
      const refresh = debounce(this.$refs.bscroll.refresh, 200);
      this.itemImgListener = () => {
        refresh();
      };
      this.$bus.$on('itemImgLoad', this.itemImgListener);

      const index = this.currentType==='pop'?0:this.currentType==='new'?1:2;
      // console.log(this.scrollY[index]);
      this.$refs.bscroll.scrollTo(0,this.scrollY[index],0);
      // console.log('-----activated----');
      this.$refs.bscroll.refresh();
    },
    deactivated() {
      this.scrollY[this.currentType==='pop'?0:this.currentType==='new'?1:2] = this.$refs.bscroll.scroll.y

      this.$bus.$off('itemImgLoad',this.itemImgListener)
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

  /*.tab-control{*/
  /*  position: sticky;*/
  /*  top: 44px;*/
  /*  background-color: #fff;*/
  /*  z-index: 9;*/
  /*}*/

  .content{
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .fixed{
    position: relative;
    background-color: #fff;
    z-index: 9;
  }

  /*.content{*/
  /*  height: calc(100% - 93px);*/
  /*  margin-top: 44px;*/
  /*  overflow: hidden;*/
  /*}*/


</style>
