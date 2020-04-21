<template>
  <div class="loading">
    <img src="./loading.gif" alt="">
    <div class="text">{{text}}</div>
  </div>
</template>

<script>
  export default {
    name: "Loading",
    props: {
      text:{
        type:String,
        default:'正在载入…………'
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  .loading
    text-align center
    img
      width: 24px
      height: 24px
    .text
      color $color-text-d
      font-size $font-size-medium
      margin-top 5px
</style>