<template>
  <transition name="slide">
    <music-list :bg-img="bgImg" :title="title" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from "../../singer/children/MusicList";
  import {mapGetters} from 'vuex'
  import {getSongList} from 'network/recommend.js'
  import {ERR_OK} from "network/config";
  import {getvkey} from "network/singer";
  import {createSongRec} from "common/js/meClass";

  export default {
    name: "Disc",
    computed: {
      title() {
        return this.disc.title
      },
      bgImg() {
        return this.disc.cover
      },
      ...mapGetters([
        'disc'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    components: {
      MusicList
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        if(!this.disc.content_id){
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.content_id).then(res => {
          if (res.code === ERR_OK) {
            // this.songs = res.cdlist[0].songlist
            // console.log(this.songs);
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)

          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(musicData => {
          getvkey(musicData.mid).then(res => {
            const purl = res.req_0.data.midurlinfo[0].purl
            if(purl){
              ret.push(createSongRec(musicData,purl))
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
    transition all 0.3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)

</style>