import {playMode} from "common/js/config";
import {loadSearch} from "common/js/cache";

const state = {
  singer: {},
  playing: false,            // 播放/暂停
  fullScreen: false,         // 播放器是否展开/全屏
  playlist: [],              // 播放列表
  sequenceList: [],          // 顺序列表
  mode: playMode.sequence,  // 播放模式
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch()
}

export default state