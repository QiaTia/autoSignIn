import $Toast from './libs/toast'
import http from './libs/http'
import { sendMessage, nowDate, saveSetting, getSetting } from './libs/utils'

const _lastSgin = 'tia_last_sgin'

const t = getSetting(_lastSgin)
let loading

document.onreadystatechange = function() {
  // 比较时间, 如果已经签到就不继续
  if(t && t == nowDate()) return true // $Toast("亲, 今天已经签到过了哦,明天再继续吧!")
  const readyState = document.readyState
  if(readyState == 'interactive') loading = $Toast({title:'自动签到中~', icon: 'load', duration: 0})
  else if(readyState == 'complete'){
    const Cookie = window.document.cookie
    const headers = {
      Cookie,
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh-CN,zh;q=0.9',
      'user-agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    }
    sendMessage({action: 'saveAccount', val: [Cookie]})
    http.get('https://vip.video.qq.com/fcgi-bin/comm_cgi', {
      name: "hierarchical_task_system",
      cmd: 2
    }, headers)
    .then(data=>{
      if(/Account Verify Error/.test(data)){
        $Toast(`腾讯视频自动签到失败, cookies失效，请更新！`)
        sendMessage({action: 'changeAccountState', val: [1]})
      }
      else{
        $Toast("自动签到成功")
        saveSetting(_lastSgin, nowDate())
      }
      loading.hide()
    }).catch(()=>{
      $Toast(`自动签到失败, 请先登陆!`)
      // changeAccountState(2)
      sendMessage({action: 'changeAccountState', val: [2]})
      loading.hide()
    })
  }
}