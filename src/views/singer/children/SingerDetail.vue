<template>
  <transition name="slide">
    <music-list :title="title" :songs="songs" :bg-img="bgImg"></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from "network/singer";
  import {ERR_OK} from "network/config";
  import {createSong} from 'common/js/meClass'
  import {getvkey} from "network/singer";
  import MusicList from "./MusicList";

  export default {
    name: "SingerDetail",
    components: {
      MusicList
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImg() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSingerDetail()
    },
    methods: {
      _getSingerDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs);
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(item => {
          let musicData = item.musicData
          getvkey(musicData.songmid).then(res => {
            // console.log(res);
            // console.log(res.req_0.data.midurlinfo[0].purl);
            const purl = res.req_0.data.midurlinfo[0].purl
            // console.log(purl);
            if (musicData.songid && musicData.albummid && purl) {
              ret.push(createSong(musicData, purl))
            }
          })
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'


  .slide-enter-active, .slide-leave-active
    transition all 0.3s

  .slide-leave-to, .slider-enter
    transform translate3d(100%, 0, 0)

</style>