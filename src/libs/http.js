/*
 * @Author: QiaTia 
 * @Date: 2020-05-20 16:28:22 
 * @Last Modified by: QiaTia
 * @Last Modified time: 2020-05-20 16:36:10
 */
const http = {
  baseUrl: '',
  stringify(obj, prefix) {
    var pairs = []
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue
      }
      var value = obj[key]
      var enkey = encodeURIComponent(key)
      var pair
      if (typeof value === 'object') {
        pair = queryStringify(value, prefix ? prefix + '[' + enkey + ']' : enkey)
      } else {
        pair = (prefix ? prefix + '[' + enkey + ']' : enkey) + '=' + encodeURIComponent(value)
      }
      pairs.push(pair)
    }
    return pairs.join('&')
  },
  request(url, data, Methods='GET', headers = {}) {
    if(!url) return Promise.reject('url must!')
    return new Promise((resolve,reject)=>{
      /^http[s]?:\/\//.test(url)||(url = this.baseUrl+url)
      data = this.stringify(data);
      Methods == 'GET'&&(url += (url.indexOf('?') === -1 ? '?' : '&') + data)
      const xmlhttp = new XMLHttpRequest()
      xmlhttp.withCredentials = true
      xmlhttp.open(Methods,url,true)
      xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded")
      xmlhttp.send(data)
      xmlhttp.onreadystatechange = function(){
        if (!xmlhttp || xmlhttp.readyState !== 4) {
          return;
        }
        if(xmlhttp.readyState === 4){
          let response = {
            headers,
            data: xmlhttp.response || xmlhttp.responseText,
            status: xmlhttp.status,
            requestURL: xmlhttp.responseURL,
            request: xmlhttp
          }
          if(xmlhttp.status !== 200){
            /json/.test(response.headers['content-type'])?reject(JSON.parse(response.data)):reject(response.data)
          }
          if(response.data){
            /json/.test(response.headers['content-type'])?resolve(JSON.parse(response.data)):resolve(response.data)
          }
        }
      }
      xmlhttp.onerror = function() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject({msg:'Network Error',config:{url, data, Methods}, xmlhttp})
      }
      xmlhttp.onabort = function() {
        if (!request) {
          return;
        }
        reject({msg:'Request aborted',config:{url, data, Methods}, xmlhttp})
      }
      xmlhttp.ontimeout = function() {
        reject({msg:'timeout of Nam ms exceeded',config:{url, data, Methods}, xmlhttp});
      }
    })
  },
  
  get(url, data, headers) {
    return this.request(url,data,'GET', headers)
  },
  /**
   *
   *
   * @param {*} url
   * @param {*} data
   * @param {*} headers
   * @returns
   */
  post(url, data, headers) {
    return this.request(url,data,'POST', headers)
  }
}

export default http