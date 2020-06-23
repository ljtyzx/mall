<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"/>
    <scroll class="scroll">
      <detail-swiper :topImages="topImages"/>
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" />
      <detail-param-info :param-info="paramInfo" />
    </scroll>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import Scroll from 'components/common/bscroll/BetterScroll'


  import {getDetail,Goods,Shop,GoodsParam} from "network/detail";

  export default {
    name: "Detail",
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {}
      }
    },
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo
    },
    created() {
      console.log('detail created');
      this.iid = this.$route.params.iid

      getDetail(this.iid).then(
        res => {
          console.log(res);
          // 1.获取顶部图片轮播图数据
          const data = res.result;
          this.topImages = data.itemInfo.topImages;

          // 2.获取商品信息
          this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

          // 3.店铺信息对象
          this.shop = new Shop(data.shopInfo);

          // 4.保存商品的详细数据
          this.detailInfo = data.detailInfo

          this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
        })
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
