<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.query)" class="item" v-for="item in hotKey">
                <span>{{item.query}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest ref="suggest" :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from "base/searchbox/SearchBox";
  import {getHotKey} from "network/search";
  import {ERR_OK} from "network/config";
  import Suggest from "./chidren/Suggest";
  import Scroll from "base/scroll/Scroll";
  import SearchList from "base/searchlist/SearchList";
  import Confirm from "base/confirm/Confirm";
  import {playlistMixin} from 'common/js/mixin'
  import {mapActions,mapGetters} from 'vuex'


  export default {
    name: "Search",
    mixins:[playlistMixin],
    components: {
      SearchBox,
      Suggest,
      Scroll,
      SearchList,
      Confirm
    },
    watch:{
      query(newQuery){
        if(!newQuery){
          setTimeout(()=>{
            this.$refs.shortcut.refresh()
          },20)
        }
      }
    },
    data() {
      return {
        hotKey: [],
        query:''
      }
    },
    created() {
      this._getHotKey()
    },
    computed:{
      shortcut(){
        return this.hotKey.concat(this.searchHistory)
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    methods: {
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

      },
      _getHotKey() {
        getHotKey().then(res => {
          if(res.code === ERR_OK){
            this.hotKey = res.hotkey.data.vec_hotkey.slice(0,15)
          }
        })
      },
      addQuery(query){
        this.$refs.searchBox.setQuery(query)
      },
      onQueryChange(query){
        this.query = query
      },
      blurInput(){
        this.$refs.searchBox.blur()
      },
      saveSearch(){
        this.saveSearchHistory(this.query)
      },
      showConfirm(){
        this.$refs.confirm.show()
      },
      // deleteOne(item){
      //   this.deleteSearchHistory(item)
      // },
      // deleteAll(){
      //   this.clearSearchHistory()
      // },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 10px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-small
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>