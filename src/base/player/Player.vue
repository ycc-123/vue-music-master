<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend.prevent="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyric"
                   class="text"
                   v-for="(line,index) in currentLyric.lines"
                   :class="{'current':currentLineNum === index}"
                >
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :data="dataTime" @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i :class="miniIcon" @click.stop="togglePlaying"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import ProgressBar from "base/progressbar/ProgressBar";
  import {playMode} from "common/js/config";
  import {shuffle} from "common/js/util";
  import Lyric from 'lyric-parser'
  import Scroll from "../scroll/Scroll";

  export default {
    name: "Player",
    components: {
      ProgressBar,
      Scroll
    },
    computed: {
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      iconMode() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      dataTime() {
        return {
          currentTime: Math.floor(this.currentTime),
          totalTime: this.currentSong.duration
        }
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    data() {
      return {
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,                    // 当前歌词所在行
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    created() {
      this.touch = {}

    },
    methods: {
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      togglePlaying() {
        this.setPlayingState(!this.playing)

        // if (this.currentLyric) {
        //   this.currentLyric.togglePlaying()
        // }
      },
      next() {
        if (this.playlist.length === 1) {
          this.loop()
          return
        }
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      },
      prev() {
        if (this.playlist.length === 1) {
          this.loop()
          return
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      format(interval) {
        interval = Math.floor(interval)
        const minute = Math.floor(interval / 60)
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      percentChange(percent) {
        // console.log(percent);
        const currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      changeMode() {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)

        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex(list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      getLyric() {
        this.currentSong.getLyric().then(lyric => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
          // console.log(this.currentLyric)
        }).catch(err => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum

        if (lineNum > 4) {
          let lineEl = this.$refs.lyric[lineNum - 4]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      middleTouchStart(e) {
        this.touch.initiated = true
        const touches = e.touches[0]
        this.touch.startX = touches.pageX
        this.touch.startY = touches.pageY
      },
      middleTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style.transitionDuration = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style.transitionDuration = 0
      },
      middleTouchEnd() {
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          } else {
            opacity = 0
            offsetWidth = -window.innerWidth
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style.transitionDuration = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      })
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        this.$nextTick(() => {
          this.$refs.audio.play()
          this.getLyric()
        })
      },
      playing(newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background

      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)

      .top
        position: relative
        margin-bottom: 25px

        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50

          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)

        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text

        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text

      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0

        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%

          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%

            .cd
              width: 100%
              height: 100%
              border-radius: 50%

              &.play
                animation: rotate 20s linear infinite

              &.pause
                animation-play-state: paused

              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)


          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center

            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l

        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden

          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center

            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium

              &.current
                color: $color-text

            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium

      .bottom
        position: absolute
        bottom: 50px
        width: 100%

        .dot-wrapper
          text-align: center
          font-size: 0

          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l

            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll

        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0

          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px

            &.time-l
              text-align: left
              margin-right 5px

            &.time-r
              text-align: right
              margin-left: 5px

          .progress-bar-wrapper
            flex: 1

        .operators
          display: flex
          align-items: center

          .icon
            flex: 1
            color: $color-theme

            &.disable
              color: $color-theme-d

            i
              font-size: 30px

          .i-left
            text-align: right

          .i-center
            padding: 0 20px
            text-align: center

            i
              font-size: 40px

          .i-right
            text-align: left

          .icon-favorite
            color: $color-sub-theme

      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s

        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)

      &.normal-enter, &.normal-leave-to
        opacity: 0

        .top
          transform: translate3d(0, -100px, 0)

        .bottom
          transform: translate3d(0, 100px, 0)

    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background

      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s

      &.mini-enter, &.mini-leave-to
        opacity: 0

      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px

        .imgWrapper
          height: 100%
          width: 100%

          img
            border-radius: 50%

            &.play
              animation: rotate 10s linear infinite

            &.pause
              animation-play-state: paused

      // 动画暂停

      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden

        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text

        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d

      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px

        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d

        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>