<template>
  <transition name="slide">
    <music-list :title="title" :bg-img="bgImg" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script>
  import MusicList from "views/singer/children/MusicList";
  import {mapGetters} from 'vuex'
  import {getTopList, getMusicList} from "network/rank";
  import {ERR_OK} from 'network/config'
  import {topList} from "../../../store/getters";
  import {getvkey} from "network/singer";
  import {createSong} from "common/js/meClass";

  export default {
    name: "TopList",
    components: {
      MusicList
    },
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImg() {
        if(this.songs.length){
          return this.songs[0].image
        }
        return
      },
      ...mapGetters([
        'topList'
      ])
    },
    data() {
      return {
        songs: [],
        rank:true
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if(!this.topList.id){
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then(res => {
          if (ERR_OK === res.code) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(item => {
          let musicData = item.data
          getvkey(musicData.songmid).then(res => {
            const purl = res.req_0.data.midurlinfo[0].purl
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

<style scoped lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition all 0.3s ease

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)

</style>