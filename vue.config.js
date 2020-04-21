const data = require('./data');
const sliderData = data.data.slider
const axios = require('axios')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "common": "@/common",
        "components": "@/components",
        "views": "@/views",
        "network": "@/network",
        "base": "@/base",
        "store": "@/store"
      }
    }
  },
  devServer: {
    before(app) {
      app.get('/api/slider', (req, res) => {
        res.json({
          errno: 0,
          data: sliderData
        })
      })
      app.get('/api/getDiscList', (req, res) => {
        let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        let url2 = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url2, {
          headers: {
            origin: 'https://y.qq.com',
            referer: 'https://y.qq.com/'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        }).catch(err => {
          console.log(err);
        })
      })
      app.get('/api/singers', (req, res) => {
        let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        }).catch(e => {
          console.log(e);
        })
      })
      // 获取 歌手 详细信息
      app.get('/api/singerDetail', (req, res) => {
        const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        }).catch(e => {
          console.log(e)
        })
      })

      // 获取 vkey
      app.get('/api/getvkey', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/portal/player.html',
            origin:'https://y.qq.com',
            'Content-type':'application/x-www-form-urlencoded'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        })
      })

      app.get('/api/getSongLyric', (req, res) => {
        let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/portal/player.html'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        })
      })

      app.get('/api/getSongList', (req, res) => {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
          headers: {
            referer: "https://c.y.qq.com/n/yqq/playlist",
            origin: "https://y.qq.com"
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        })
      })

      // 获取榜单列表
      app.get('/api/getTopList', (req, res) => {
        const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        })
      })

      //获取榜单歌曲
      app.get('/api/getMusicList', (req, res) => {
        const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        })
      })

      // 搜索热门
      app.get('/api/getHotKey', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          headers: {
            origin: "https://y.qq.com",
            referer: "https://y.qq.com/m/index.html?tab=recommend"
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        })
      })

      // 搜索接口
      app.get('/api/getSearch', (req, res) => {
        const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
        axios.get(url, {
          headers: {
            origin: 'https://y.qq.com',
            referer: 'https://y.qq.com/portal/search.html'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        })
      })
    }
  }
}