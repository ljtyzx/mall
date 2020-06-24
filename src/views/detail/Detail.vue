<template>
  <div id="detail">
    <detail-nav-bar @titleClick="titleClick" class="detail-nav"/>
    <scroll :probe-type="3"
            :click="true"
            @scroll="scroll"
            ref="scroll"
            class="scroll">
      <detail-swiper :topImages="topImages"/>
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="detailImageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommend" />
    </scroll>
    <back-top v-show="showBackTop" @click.native="backClick"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import BackTop from 'components/content/backTop/BackTop'
  import Scroll from 'components/common/bscroll/BetterScroll'
  import GoodsList from 'components/content/goods/GoodsList'

  import {itemListenerMixin} from "common/mixin"
  import {getDetail,getRecommend,Goods,Shop,GoodsParam} from "network/detail";
  import {debounce} from "../../common/utils";

  export default {
    name: "Detail",
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommend: [],
        themeTopYs: [],
        getThemeTopY: null,
        showBackTop: false,
      }
    },
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      BackTop,
      GoodsList,
      Scroll,
    },
    created() {
      console.log('detail created');
      // 获取商品iid
      this.iid = this.$route.params.iid

      // 请求详情数据
      getDetail(this.iid).then(
        res => {
          // console.log(res);
          // 1.获取顶部图片轮播图数据
          const data = res.result;
          this.topImages = data.itemInfo.topImages;

          // 2.获取商品信息
          this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

          // 3.店铺信息对象
          this.shop = new Shop(data.shopInfo);

          // 4.保存商品的详细数据
          this.detailInfo = data.detailInfo

          // 5.参数信息
          this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

          // 6.评论信息
          if(data.rate.cRate !== 0) {
            this.commentInfo = data.rate.list[0];
          }

          this.$nextTick(() => {
            this.themeTopYs = [];

            this.themeTopYs.push(0);
            this.themeTopYs.push(this.$refs.param.$el.offsetTop);
            this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
            this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

            console.log(this.themeTopYs);
          })

        });

      // 请求推荐数据
      getRecommend().then(
        res=>{
          this.recommend = res.data.list;
        })

      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];

        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.param.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

        console.log(this.themeTopYs);
      })

    },
    mixins: [itemListenerMixin],
    mounted() {
    },
    methods:{
      detailImageLoad() {
        this.$refs.scroll.refresh();

        this.getThemeTopY();
      },
      scroll(position) {
        this.showBackTop = position.y < -1000;
      },
      backClick() {
        this.$refs.scroll.scrollTo(0,0,500);
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
      }
    },
    destroyed() {
      this.$bus.$off('itemImgLoad',this.detailItemImgListener);
    }
  }
</script>

<style scoped>
  #detail{
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .scroll{
    position: absolute;
    top: 44px;
    bottom: 60px;
  }
</style>
