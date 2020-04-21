import jsonp from 'common/js/jsonp'
import {commonParams, options} from "./config";
import axios from 'axios'

export function getSingerList() {
  const url = '/api/singers'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 1664029744
  })

  // return jsonp(url,data,options)
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })

}

export function getSingerDetail(singerId) {
  const url = '/api/singerDetail'
  const data = Object.assign({}, commonParams, {
    g_tk: 1664029744,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: "listen",
    begin: 0,
    num: 100,
    songstatus: 1,
    singermid: singerId
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getvkey(songid) {
  const url = '/api/getvkey'
  const data = Object.assign({}, commonParams, {
    g_tk: 2064441524,
    loginUin: 1052670316,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: `{"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"8427993440","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"8427993440","songmid":["${songid}"],"songtype":[0],"uin":"1052670316","loginflag":1,"platform":"20"}},"comm":{"uin":1052670316,"format":"json","ct":24,"cv":0}}`
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSongLyric(songId) {
  const url = '/api/getSongLyric'
  const data = Object.assign({}, commonParams, {
    pcachetime: 1578297556315,
    songmid: songId,
    g_tk: 2064441524,
    loginUin: 1052670316,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf' - 8,
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}



