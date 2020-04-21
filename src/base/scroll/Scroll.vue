<template>
  <div class="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)


    },
    methods: {
      _initScroll() {
        // 未知 含义
        if (!this.$refs.wrapper) {
          // console.log('hehe');
          return
        }

        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          pullUpLoad: this.pullUpLoad
        })

        if (this.probeType === 3) {
          this.scroll.on('scroll', pos => {
            this.$emit('scroll', pos.y)
          })
        }

        // if(this.pullUp){
        //   console.log(3);
        //   this.scroll.on('pullingUp',()=>{
        //     console.log(1);
        //   })
        // }
        if (this.pullUpLoad) {
          this.scroll.on('pullingUp', () => {
            this.$emit('pullingUp')
          })
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }

      },
      //启用 better-scroll, 默认 开启
      enable() {
        this.scroll && this.scroll.enable()
      },
      //禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应
      disable() {
        this.scroll && this.scroll.disable()
      },
      // 重新渲染 Better-Scroll
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      }
    },
    watch: {
      // 侦听数据改变 调用refresh 重新计算/渲染
      data() {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>