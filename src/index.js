import http from './libs/http'
import { saveAccount, changeAccountState } from './libs/account'
import { rand } from './libs/utils'

const _installed = 'tia_installed'

chrome.runtime.onInstalled.addListener(() => {
  const installed = localStorage.getItem(_installed)
  if (installed) {
    console.log("已经安装")
  } else {
    localStorage.setItem(_installed, new Date());
    chrome.tabs.create({url: "/popup.html"}, function (tab) {
      console.log("京价保安装成功！");
    })
  }
})

// 判断浏览器
try {
  browser.runtime.getBrowserInfo().then((browserInfo) => {
    localStorage.setItem('browserName', browserInfo.name)
    console.log(browserInfo)
  })
} catch (error) {}

// This is to remove X-Frame-Options header, if present
chrome.webRequest.onHeadersReceived.addListener(
  function(info) {
    var headers = info.responseHeaders;
    for (var i=headers.length-1; i>=0; --i) {
      var header = headers[i].name.toLowerCase();
      if (header == 'x-frame-options' || header == 'frame-options') {
          headers.splice(i, 1); // Remove header
      }
    }
    return {responseHeaders: headers};
  },
  {
      urls: ['*://*.jd.com/*', '*://*.jd.hk/*'], //
      types: ['sub_frame']
  },
  ['blocking', 'responseHeaders']
);

// 用手机模式打开
function openWebPageAsMobile(url) {
  chrome.windows.create({
    width: 420,
    height: 800,
    url: url,
    type: "popup"
  })
}

// 监听消息
chrome.runtime.onMessage.addListener(function(greeting, sender, sendResponse){
  const _this = { saveAccount, changeAccountState }
  // code...
  if(typeof greeting == 'obeject' && greeting.action){
    _this[greeting.action](...greeting.val)
    sendResponse(JSON.stringify(Object.keys(_this)))//做出回应
  }
})

function openByIframe(src, type, delayTimes = 0) {
  // 加载新的任务
  let iframeId = "iframe"
  let keepMinutes = 6
  if (type == 'temporary') {
    iframeId = 'iframe' + rand(10241024)
    keepMinutes = 1
  }
  // 当前任务过多则等待
  if (document.querySelectorAll('iframe').length > 5 && delayTimes < 6) {
    setTimeout(() => {
      openByIframe(src, type, delayTimes + 1)
    }, (10 + rand(10)) * 1000);
    return console.log('too many iframe pages', src, delayTimes)
  }
  // 运行
  resetIframe(iframeId)
  document.querySelector("#" + iframeId).src = src
  // $().attr('src', src)
  // 设置重置任务
  chrome.alarms.create((type == 'temporary' ? 'destroyIframe_' : 'clearIframe_') + iframeId, {
    delayInMinutes: keepMinutes
  })
}

function resetIframe(domId) {
  const old = document.querySelector("#" + iframeId)
  if(old) old.remove()
  // $("#" + domId).remove();
  const iframeDom = document.createElement("iframe")
  iframeDom.setAttribute("id", domId)
  iframeDom.setAttribute("width", '400px')
  iframeDom.setAttribute("height", '600px')
  // iframe.width='400px'
  // iframe.height = '600px'
  // let iframeDom = `<iframe id="${domId}" width="400px" height="600px" src=""></iframe>`;
  document.body.append(iframeDom);
}