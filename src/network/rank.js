import jsonp from 'common/js/jsonp'
import axios from 'axios'
import {commonParams, options} from "./config";

export function getTopList() {
  const url = '/api/getTopList'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    g_tk: 67232076,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getMusicList(topid) {
  const url = '/api/getMusicList'
  // const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    page:'detail',
    platform: 'h5',
    topid:topid,
    type: 'top',
    tpl:3,
    needNewCode: 1,
    uin:0,
    format:'jsonp',
    notice:0,
    g_tk:1117927041
    // topid,
    // needNewCode: 1,
    // uin: 0,
    // tpl: 3,
    // page: 'detail',
    // type: 'top',
    // platform: 'h5'
  })

  return axios.get(url,{
    params:data
  }).then(res=>{
    return Promise.resolve(res.data)
  })
  // return jsonp(url, data, options)
}
