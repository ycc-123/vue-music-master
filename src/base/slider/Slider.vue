<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span @click="dotClick(index)" class="dot" v-for="(item,index) in dots"
            :class="{active:currentIndex === index}"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    name: "Slider",
    props: {
      loop: {      //是否 能循环轮播
        type: Boolean,
        default: true
      },
      autoPlay: {   //是否 自动轮播
        type: Boolean,
        default: true
      },
      interval: {  //多少秒 自动轮播一次
        type: Number,
        default: 3000
      }
    },
    data() {
      return {
        dots: [],
        currentIndex: 0
      }
    },
    activated() {
      // console.log('slider-activated');
      this._play()

    },
    deactivated() {
      // console.log('slider-deactivated');
      clearTimeout(this.timer)
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        // this.slider.goToPage(0, 0, 400)
        if (this.autoPlay) {
          this._play()
        }
      }, 20)
      // 改变浏览器 resize 时，重新计算高度
      window.addEventListener('resize', () => {
        if(!this.slider){
          return
        }
        this._setSliderWidth(true)
      })
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }

        this.$refs.sliderGroup.style.width = width + 'px'

      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,     //允许   横向滚动
          scrollY: false,    //不允许 纵向滚动
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400,
            autoPlay: true,
            interval: this.interval
          },
          click: true
        })

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX

          this.currentIndex = pageIndex

          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }

        })
      },
      _initDots() {    // 初始化 dots
        this.dots = new Array(this.children.length)
      },
      _play() {
        this.timer = setTimeout(() => {
          this.slider.next(400)
        }, this.interval)

      },
      dotClick(index) {
        clearTimeout(this.timer)
        this.currentIndex = index
        this.slider.goToPage(index)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .slider
    min-height 1px

    .slider-group
      position relative
      overflow hidden
      white-space nowrap

      .slider-item
        float left
        box-sizing border-box
        overflow hidden
        text-align center

        /*a*/
        /*  display block*/
        /*  width: 100%*/
        /*  overflow hidden*/
        /*  text-decoration none*/

        img
          display block
          width 100%

    .dots
      position: absolute
      bottom: 12px
      right: 0
      left: 0
      width: 100%
      height 8px
      font-size 0
      text-align center

      .dot
        width: 8px
        height: 8px
        border-radius 50%
        /*background-color: hsla(0, 0%, 100%, .5)*/
        background-color: $color-text-l
        display: inline-block
        margin 0 4px

        &.active
          color: #fff
          background-color: #color-text-ll
          width: 20px
          border-radius 5px


</style>