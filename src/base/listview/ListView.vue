<template>
  <scroll
      :data="data"
      class="list-view"
      ref="listView"
      :probeType="3"
      @scroll="scroll">
    <ul>
      <li v-for="group in data" ref="listGroup" class="groupItem">
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="item" @click="itemClick(item)">
            <img v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="shortcut-list" @touchmove.stop.prevent="touchMove">
      <ul>
        <li v-for="(item,index) in shortcutList"
            :class="{current:currentIndex===index}"
            :data-index="index"
            @touchstart.prevent="touchStart"
            @click="listItemClick(index)">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="title-fix" ref="titlefix" v-if="titleCurrent">
      <h2 class="title">{{titleCurrent}}</h2>
    </div>
  </scroll>
</template>

<script>
  import Scroll from "base/scroll/Scroll";
  import {getData} from 'common/js/dom'
  import {currentIndex} from "store/getters";

  export default {
    name: "listView",
    components: {
      Scroll
    },
    props: {
      data: {
        type: Array
      }
    },
    data() {
      return {
        currentIndex: 0,
        scrollY: 0,
        listHeight: [],
        firstTouch: null,
        diff: -1
      }
    },
    created() {
      // console.log(this.data);
    },
    mounted() {
      setTimeout(() => {
        this.listHeight = this.calculateHeight()
      }, 20)
    },
    computed: {
      shortcutList() {
        return this.data.map(item => {
          return item.title.substr(0, 1)
        })
      },
      titleCurrent() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex].title
      }
    },
    watch: {
      scrollY(newY) {
        let listHeight = this.listHeight
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]

          if (height2 && (-newY > height1 && -newY < height2)) {
            this.currentIndex = i
            this.diff = height2 + newY
          }
        }
      },
      diff(newValue) {
        let fixTop = newValue > 0 && newValue < 30 ? (30 - newValue) : 0
        this.$refs.titlefix.style.transform = `translate3d(0,-${fixTop}px,0)`
        // this.$refs.titlefix.style.transform = `translateY(0,-${fixTop}px)`
      }
    },

    methods: {
      listItemClick(i) {
        this.currentIndex = i
      },
      touchStart(el) {
        let anchorIndex = getData(el.target, 'data-index')
        anchorIndex = parseInt(anchorIndex)
        this.$refs.listView.scrollToElement(this.$refs.listGroup[anchorIndex], 0)

        this.firstTouch = el.touches[0].clientY
      },
      touchMove(el) {
        // let height = el.target.clientHeight
        // let toHeight = el.touches[0].clientY
        // let moveHeight = toHeight - this.firstTouch
        // let num = Math.round(moveHeight / height)
        // this.currentIndex += num

        // this.$refs.listView.scrollToElement(this.$refs.listGroup[num])
      },
      scroll(p) {
        this.scrollY = p
      },
      refresh(){
        this.$refs.listView.refresh()
      },
      calculateHeight() {
        let heightArray = []
        let height = 0
        heightArray.push(height)
        this.childrens = this.$refs.listGroup
        for (let i in this.childrens) {
          let children = this.childrens[i]
          height += children.clientHeight
          heightArray.push(height)
        }
        return heightArray
      },
      itemClick(item){
        this.$emit('select',item)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  .list-view
    position relative
    width: 100%
    height 100%
    overflow: hidden;
    background-color: $color-background
    ul
      .groupItem

        .title
          background-color: #333
          height 30px
          line-height: 30px
          font-size: $font-size-small
          padding-left 20px
          color hsla(0, 0%, 100%, .5)
          margin-bottom:20px

        ul
          .item
            display flex
            padding: 0 0 20px 30px

            img
              width: 50px
              height: 50px
              flex 0 0 50px

            .name
              display inline-block
              flex 1
              line-height 50px
              font-size $font-size-medium
              color hsla(0, 0%, 100%, .5)
              padding-left: 20px


    .shortcut-list
      position absolute
      right: 0
      top: 50%
      transform translateY(-50%)
      background-color: $color-background-d
      padding 20px 0
      width: 20px
      border-radius 10px
      z-index 99

      ul
        li
          color hsla(0, 0%, 100%, .5)
          font-size $font-size-small
          text-align: center
          padding 3px 0

          &.current
            color $color-theme


  .title-fix
    position: absolute
    top: 0
    left: 0
    width: 100%
    .title
      background-color: #333
      height 30px
      line-height: 30px
      font-size: $font-size-small
      padding-left 20px
      color hsla(0, 0%, 100%, .5)

</style>