import {debounce} from "./utils";
import BackTop from 'components/content/backTop/BackTop'


export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200);

    this.itemImgListener = () => {
      refresh();
    };
    this.$bus.$on('itemImgLoad', this.itemImgListener);
  }
}

export const backTopMixin = {
  data() {
    return {
      showBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0,0,500);
    },
    listenShowBckTop(position) {
      this.showBackTop = position.y < -1000;
    }
  }
}
