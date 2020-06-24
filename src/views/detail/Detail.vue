<template>
  <div id="detail">
    <detail-nav-bar @titleClick="titleClick" ref="nav" class="detail-nav"/>
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
    <detail-bottom-bar @addToCart="addToCart" />
    <back-top v-show="showBackTop" @click.native="backClick"/>
<!--    <toast :message="message" :show="showToast" />-->
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
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from 'components/common/bscroll/BetterScroll'
  // import Toast from 'components/common/toast/Toast'
  import GoodsList from 'components/content/goods/GoodsList'

  import {itemListenerMixin,backTopMixin} from "common/mixin"
  import {getDetail,getRecommend,Goods,Shop,GoodsParam} from "network/detail";
  import {debounce} from "../../common/utils";

  import {mapActions} from  'vuex'

  export default {
    name: "Detail",
    data() {
      return {
        iid: null,
        currentIndex: 0,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommend: [],
        themeTopYs: [],
        getThemeTopY: null,
        // message: '',
        // showToast: false
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
      DetailBottomBar,
      GoodsList,
      // Toast,
      Scroll,
    },
    created() {
      // console.log('detail created');
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
        this.themeTopYs.push(Number.MAX_VALUE);

        // console.log(this.themeTopYs);
      }, 100)

    },
    mixins: [itemListenerMixin,backTopMixin],
    mounted() {
    },
    methods:{
      ...mapActions({
        addCart: 'addCart'
      }),
      detailImageLoad() {
        this.$refs.scroll.refresh();

        this.getThemeTopY();
      },
      scroll(position) {
        this.listenShowBckTop(position);
        
        // const positionY = -position.y;
        // const length = this.themeTopYs.length
        // for (let i = 0;i < length; i++) {
        //   if (this.currentIndex !== i &&
        //     ((i < length-1 && positionY >= this.themeTopYs[i] && positionY <= this.themeTopYs[i+1]) ||
        //       (i === length-1 && positionY >= this.themeTopYs[i]))) {
        //     this.currentIndex = i;
        //     this.$refs.nav.currentIndex = this.currentIndex;
        //   }
        // }

        // const positionY = -position.y;
        // this.themeTopYs.filter((value,index) => {
        //   let isBreak = false;
        //   if (isBreak) {
        //     return false;
        //   }
        //   if (positionY >= value) {
        //     this.themeTopYs.filter((value1,index1) => {
        //       if (isBreak) {
        //         return false;
        //       }
        //       if (index1 > index && positionY < value1) {
        //         this.currentIndex = index1-1;
        //         isBreak = true;
        //       }
        //       this.currentIndex = index;
        //     })
        //   }
        // })

        const positionY = -position.y;
        let length = this.themeTopYs.length
        for (let i = 0; i < length - 1; i++) {
          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
            this.currentIndex = i;
          }
        }
      },

      titleClick(index) {
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],500)
      },

      addToCart() {
        // 1.购物车需展示信息
        const product = {};
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        this.addCart(product).then(res => {

          this.$toast.show(res , 2000)
          // this.showToast = true;
          // this.message = res;
          //
          // setTimeout(() => {
          //   this.show = false;
          //   this.message = ''
          // }, 1500)
        })
        // this.$store.dispatch('addCart',product).then(res => {
        //
        // })
      }
    },
    watch: {
      currentIndex(newValue,oldValue) {

        this.$refs.nav.currentIndex = newValue
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
