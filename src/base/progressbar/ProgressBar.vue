<template>
  <div class="progress-bar" @click="progressClick">
    <div class="bar-inner" ref="bar">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend.prevent="progressTouchEnd">
        <div class="progress-btn" ref="progressBtnChild"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ProgressBar",
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        progressWidth: 0
      }
    },
    watch: {
      data(newData) {
        if (!this.touch.initiated) {
          const totalWidth = this.$refs.bar.clientWidth
          this.progressWidth = newData.currentTime / newData.totalTime * totalWidth
          // console.log(this.progressWidth);
          this._offset(this.progressWidth)
        }
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressTouchStart(e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
        console.log(this.touch);
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        this.touch.deltaX = e.touches[0].pageX - this.touch.startX
        this.touch.width = Math.min(this.$refs.bar.clientWidth - this.$refs.progressBtnChild.clientWidth+10, Math.max(0, this.touch.left + this.touch.deltaX))
        this._offset(this.touch.width)
      },
      progressTouchEnd() {
        this.touch.initiated = false
        const percent = this.touch.width / this.$refs.bar.clientWidth
        this.$emit('percentChange', percent)
      },

      _offset(width){
        this.$refs.progress.style.width = `${width}px`
        this.$refs.progressBtn.style.transform = `translate3d(${width-8}px,0,0)`
      },
      progressClick(e) {
        this._offset(e.offsetX)
        // console.log(this.$refs.progress.clientWidth);
        // console.log(this.$refs.bar.clientWidth);
        const percent = this.$refs.progress.clientWidth / this.$refs.bar.clientWidth
        this.$emit('percentChange', percent)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'

  .progress-bar
    height 30px

    .bar-inner
      position relative
      top: 13px
      height: 4px
      background-color: rgba(0, 0, 0, .3)

      .progress
        position absolute
        height 100%
        background-color: $color-theme

      .progress-btn-wrapper
        position: absolute
        left -8px
        top: -13px
        width: 30px
        height: 30px

        .progress-btn
          position relative
          top: 7px
          left: 7px
          box-sizing border-box
          width: 16px
          height: 16px
          border: 3px solid #fff
          border-radius 50%
          background $color-theme

</style>