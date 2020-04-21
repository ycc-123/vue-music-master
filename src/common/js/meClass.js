import {getSongLyric} from "network/singer";
import {ERR_OK} from "network/config";
import {Base64} from 'js-base64'

export class Singer {
  constructor({id, name}) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg`
  }
}

export class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getSongLyric(this.mid).then(res => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          // this.lyric = res.lyric
          resolve(this.lyric)
        }else{
          reject('no lyric')
        }
      })
    })

  }
}

export function createSong(musicData, purl) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://isure.stream.qqmusic.qq.com/${purl}`
  })
}

export function createSongRec(musicData,purl){
  return new Song({
    url: `http://isure.stream.qqmusic.qq.com/${purl}`,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
    id: musicData.id,
    mid: musicData.mid,
    singer: musicData.singer[0].name,
    name: musicData.name,
    album: musicData.album.name,
    duration: musicData.interval
  })
}

export function createSearchSongs(musicData,purl){
  return new Song({
    url: `http://isure.stream.qqmusic.qq.com/${purl}`,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
    id: musicData.singer[0].id,
    mid: musicData.singer[0].mid,
    singer: musicData.singer[0].name,
    name: musicData.name,
    album: musicData.album.name,
    duration: musicData.interval
  })
}


export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}


