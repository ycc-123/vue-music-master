import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((res, rej) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        res(data)
      } else {
        rej(err)
      }
    })
  })
}

function param(data) {
  let url = ''
  for (let i in data) {
    let value = data[i] !==undefined ? data[i] : ''
    url += `&${i}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}


