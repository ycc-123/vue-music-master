<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-img" :style="bgStyle" ref="bgImg">
      <div class="filter"></div>
    </div>
    <scroll :data="songs" class="list" ref="list" >  <!--:probeType="3" @scroll="scroll"-->
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs" :rank="rank"></song-list>
      </div>
      <div class="loading-container" v-if="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from "base/scroll/Scroll";
  import SongList from "base/songlist/SongList";
  import Loading from "base/loading/Loading";
  import {mapActions} from 'vuex'
  import {selectPlay} from "store/actions";
  import {playlistMixin} from "common/js/mixin";

  export default {
    name: "MusicList",
    mixins:[playlistMixin],
    components: {
      Scroll,
      SongList,
      Loading
    },
    props: {
      bgImg: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default() {
          return []
        }
      },
      title: {
        type: String,
        default: ''
      },
      rank:{
        type:Boolean,
        default:false
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImg})`
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    created() {

    },
    mounted() {
      this.$refs.list.$el.style.top = `${this.$refs.bgImg.clientHeight}px`
    },
    methods: {
      back() {
        this.$router.back()
      },
      selectItem(item,index){
        this.selectPlay({
          list:this.songs,
          index
        })
      },
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      ...mapActions([
        'selectPlay'
      ])
    },
    watch: {
      scrollY(newY) {
        this.$refs.layer.style['transform'] = `translate3d(0,${newY},0)px`
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .music-list
    position fixed
    z-index: 100
    top: 0
    bottom: 0
    left: 0
    right: 0
    background-color: $color-background
    width: 100%
    height: 100%

    .back
      position absolute
      top: 0
      left: 6px
      z-index 50

      .icon-back
        display block
        padding: 10px
        font-size: $font-size-large-x
        color $color-theme

    .title
      position absolute
      no-wrap()
      font-size: $font-size-large
      color $color-text
      width: 80%
      left: 10%
      top: 0
      text-align center
      line-height 40px
      z-index 40

    .bg-img
      position relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin top
      background-size cover
      z-index 12

      .play-wrapper
        position absolute
        bottom: 20px
        z-index: 50
        width: 100%

        .play
          box-sizing border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align center
          border: 1px solid $color-theme
          color $color-theme
          border-radius 100px
          font-size: 0

          .icon-play
            display inline-block
            vertical-align middle
            margin-right: 6px
            font-size: $font-size-medium-x

          .text
            display inline-block
            vertical-align middle
            font-size: $font-size-small


      .filter
        position absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background-color: rgba(7, 17, 27, .4)
        z-index 10

    .bg-layer
      position relative
      height: 100%
      background-color: $color-background

    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background-color: $color-background

      .song-list-wrapper
        padding: 0px 30px

      .loading-container
        position absolute
        width: 100%
        top: 50%
        transform translateY(-50%)
</style>