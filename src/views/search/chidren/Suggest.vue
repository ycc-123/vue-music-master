<template>
  <scroll class="suggest"
          :data="result"
          :pullUpLoad="true"
          @pullingUp="searchMore"
          ref="scroll"
          :beforeScroll="true"
          @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li class="suggest-item"
          @click="selectItem(item)"
          v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉, 暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
  import {Search} from "network/search";
  import Scroll from "base/scroll/Scroll";
  import {ERR_OK} from 'network/config'
  import {createSearchSongs} from "common/js/meClass";
  import {getvkey} from "network/singer";
  import Loading from "base/loading/Loading";
  import {Singer} from 'common/js/meClass'
  import {mapMutations,mapActions} from 'vuex'
  import NoResult from "base/noresult/NoResult";


  const LOAD_NUM = 30

  export default {
    name: "Suggest",
    components: {
      Scroll,
      Loading,
      NoResult
    },
    props: {
      query: {
        type: String,
        default: ""
      },
      showSinger: {
        type: Boolean,
        deafult: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        addResult: [],
        hasMore: true,
        time:null
      };
    },
    methods: {
      _search() {
        this.page = 1
        Search(this.query, this.page,LOAD_NUM).then(res => {
          if (res.code === ERR_OK) {
            this.result = this.normalizeRes(res.data)
          }
        });
      },
      normalizeRes(data) {
        let ret = []
        if (data.zhida.zhida_singer) {
          ret.push({...data.zhida, ...{type: 'singer'}})
        }
        const list = data.song.list
        list.forEach(item => {
          getvkey(item.mid).then(res => {
            const purl = res.req_0.data.midurlinfo[0].purl
            if (purl) {
              ret.push(createSearchSongs(item, purl))
            }
          })
        })
        return ret
      },
      getIconCls(item) {
        if (item.type === 'singer') {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === 'singer') {
          return item.zhida_singer.singerName
        } else {
          return `${item.name}-${(item.singer)}`
        }
      },
      // 上啦加载更多
      searchMore() {
        console.log(this.result);
        if (this.hasMore) {
          this.page++
        } else {
          return
        }
        Search(this.query, this.page).then(res => {
          if (res.code === ERR_OK) {
            if(res.data.song.curnum === res.data.song.curpage){
              this.hasMore = false
            }
            this.addResult = this.normalizeRes2(res.data.song.list)
          }
        })
      },
      normalizeRes2(list) {
        let ret = []
        list.forEach(item => {
          getvkey(item.mid).then(res=>{
            const purl = res.req_0.data.midurlinfo[0].purl
            if(purl){
              ret.push(createSearchSongs(item,purl))
            }
          })
        })
        return ret
      },
      listScroll(){
        this.$emit('listScroll')
      },
      selectItem(item){
        if(item.type === 'singer'){
          const singer = new Singer({
           id:item.zhida_singer.singerMID,
           name:item.zhida_singer.singerName
          })
          console.log(singer);
          this.$router.push({
            path:`/search/${singer.id}`
          })
          this.setSinger(singer)
        }else{
          this.insertSong(item)
        }
        this.$emit('select')
      },
      refresh(){
        this.$refs.scroll.refresh()
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query(newVal) {
        if (newVal.trim() === '') {
          return
        }
        this._search()
      },
      addResult(newVal){
        if(this.time){
          clearTimeout(this.time)
        }
        this.time = setTimeout(()=>{
          console.log('改变了addResult');
          console.log(newVal);
          this.result = this.result.concat(this.addResult)
          this.loading = false
          this.$refs.scroll.finishPullUp()
        },1000)
      }

    }
  };
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable';
  @import '~common/stylus/mixin';

  .suggest
    height: 100%;
    overflow: hidden;
    .suggest-list
      padding: 0 30px;
      .suggest-item
        display: flex;
        align-items: center;
        padding-bottom: 20px;
      .icon
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-']
          font-size: 14px;
          color: $color-text-d;
      .name
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text
          no-wrap();
    .no-result-wrapper
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);

    .loading
      position fixed
      bottom: 0
      width 100%
</style>