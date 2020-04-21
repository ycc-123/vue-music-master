<template>
  <div class="header">
    <div class="icon"></div>
    <div class="text">YCC Music 私人订制</div>
  </div>
</template>

<script>
  export default {
    name: "Header"
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .header
    position:relative
    text-align:center
    height:44px
    font-size 0
    background-color: $color-background
    /*z-index 9*/
    color $color-theme
    .icon
      margin-top 6px
      margin-right 9px
      display inline-block
      bg-image('logo')
      background-size: 30px 30px;
      width: 30px
      height: 30px
    .text
      display inline-block
      font-size:$font-size-large
      vertical-align top
      line-height 44px

</style>