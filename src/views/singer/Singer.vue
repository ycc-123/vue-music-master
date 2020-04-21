<template>
  <div class="singer" ref="singer">
    <list-view v-if="isSingers" :data="singers" @select="toSingerDetail" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from "network/singer";
  import {ERR_OK} from "network/config";
  import {Singer} from "common/js/meClass";
  import ListView from "base/listview/ListView";
  import {mapMutations} from 'vuex'
  import {playlistMixin} from "common/js/mixin";

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    name: "Singer",
    mixins:[playlistMixin],
    components: {
      ListView
    },
    data() {
      return {
        singers: [],
        isSingers: false
      }
    },
    created() {
      this._getSingerList()
    },
    mounted() {

    },
    methods: {
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ?  "60px" : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list && this.$refs.list.refresh()
      },
      _getSingerList() {
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            this.singers = this._resetSinger(res.data.list)
          }
        })
      },
      _resetSinger(list) {
        let map = {
          'hot': {
            title: HOT_NAME,
            items: []
          }
        }

        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map['hot'].items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: item.Findex,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        // 得到 有序列表
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        // console.log(map);
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        this.isSingers = true
        return hot.concat(ret)
      },
      toSingerDetail(item) {
        this.$router.push({
          path: `/singer/${item.id}`
        })
        this.setSinger(item)
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus">
  .singer
    position fixed
    top 88px
    bottom: 0
    width: 100%

</style>