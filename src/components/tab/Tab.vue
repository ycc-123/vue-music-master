<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: "Tab"
  }
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  .tab
    display flex
    height 44px
    line-height 44px
    font-size 0
    position relative
    /*z-index 9*/
    background-color: $color-background
    .tab-item
      flex 1
      text-align center
      &.router-link-active
        .tab-link
          border-bottom: 2px solid $color-theme
          color:$color-theme
      .tab-link
        color:$color-text-l
        font-size $font-size-medium
        padding-bottom 5px
</style>