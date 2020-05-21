export const rand = function (n) {
  return (Math.floor(Math.random() * n + 1));
}

export const price = function (price) {
  return Number(Number(price).toFixed(2))
}

 /**
 *
 * @description 获得配置
 * @param {*} settingKey
 * @param {*} defaultValue
 * @returns
 */
export const getSetting = function (settingKey, defaultValue) {
  let setting = localStorage.getItem(settingKey)
  if (setting) {
    try {
      setting = JSON.parse(setting)
    } catch (error) { }
  }
  return setting ? setting : defaultValue
}

 /**
 *
 * @description 保存配置
 * @param {*} settingKey
 * @param {*} value
 * @returns
 */
export const saveSetting = function (settingKey, value) {
  return localStorage.setItem(settingKey, JSON.stringify(value))
}

export const sendMessage = function(greeting){
  chrome.runtime.sendMessage(greeting,
    function(response) {
      console.log('收到来自后台的回复：' + response);
    }
  )
}

/**
 *
 * @description 返回当前日期
 * @returns y-m-d
 */
export const nowDate = function() {
  const _ = new Date()
  const year = _.getFullYear()
  const month = _.getMonth()+1
  const day = _.getUTCDate()
  return [year,month,day].join('-')
}