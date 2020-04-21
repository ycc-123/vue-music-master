<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommend.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommend">
              <a :href="item.linkUrl">
                <img @load="loadImg" :src="item.picUrl" alt="">
                <!--                <img @load="loadImg" v-lazy="item.picUrl" alt="">-->
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="item in discList" class="item">
              <div class="icon">
                <img width="65" height="65" v-lazy="item.cover" alt="">
              </div>
              <div class="text">
<!--                <h2 class="name">{{item.creator.name}}</h2>-->
<!--                <div class="desc">{{item.dissname}}</div>-->
                <h2 class="name">{{item.title}}</h2>
                <div class="desc">{{item.username}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <loading class="loading" v-show="!discList.length"></loading>
    <router-view></router-view>
  </div>
</template>

<script>
  import Slider from "base/slider/Slider";
  import {getDiscList} from "network/recommend";
  import {sliderData} from 'network/getslider.js'
  import Scroll from "base/scroll/Scroll";
  import Loading from "base/loading/Loading";
  import {mapMutations} from 'vuex';
  import {playlistMixin} from "common/js/mixin";


  export default {
    name: "Recommend",
    mixins:[playlistMixin],
    components: {
      Slider,
      Scroll,
      Loading
    },
    created() {
      this._getSliderData()
      this._getDiscList()
      // getSongList()
    },
    data() {
      return {
        recommend: [],
        discList: []
      }
    },
    methods: {
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      // 获取本地 轮播图 数据
      _getSliderData() {
        sliderData().then(res => {
          // console.log(res);
          this.recommend = res
        })
      },
      _getDiscList() {
        getDiscList().then(res => {
          // this.discList = res.data.list
          this.discList = res.recomPlaylist.data.v_hot
        })
      },
      loadImg() {
        // 只执行一次
        if (!this.checkLoaded) {
          this._getSliderData()
          this.checkLoaded = true
        }
        this.$refs.scroll.refresh()
      },
      selectItem(item){
        this.$router.push({
          path:`recommend/${item.content_id}`
        })
        this.setDisc(item)
      },
      ...mapMutations({
        setDisc:'SET_DISC'
      })
    },
    destroyed() {
      console.log('destroyed');
    },
  }
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  .recommend
    position fixed
    width: 100%
    top 88px
    bottom: 0

    .recommend-content
      height 100%
      overflow hidden

      .slider-wrapper
        position relative
        width: 100%
        overflow hidden

      /*.slider-item*/
      /*  display:inline-block*/
      /*  img*/
      /*    width: 100%*/
      /*    height 128px*/

      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme

        ul
          .item
            display: flex
            padding 0 20px 20px 20px
            align-items center

            .icon
              font-size: 0
              flex 0 0 65px
              width: 65px
              margin-right 20px

            .text
              flex 1
              display flex
              flex-direction column
              justify-content center
              font-size: 0
              line-height 20px
              overflow hidden


              .name
                font-size: $font-size-medium
                margin-bottom: 10px

              .desc
                font-size: $font-size-medium
                color $color-text-d


    .loading
      position absolute
      top: 50%
      width: 100%
      transform translateY(-50%)

</style>