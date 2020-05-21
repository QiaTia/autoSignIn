import { getSetting, saveSetting } from './utils'

const _account = 'tia_account'

export const getLoginState = function () {
  const loginState = getSetting(_account, { state: "unknown" })
  // 处理登录状态
  return loginState
}

// state alive/verify/unknown
export const saveAccount = (account, state = 'alive') => {
  return saveSetting(_account, { account, state })
}

export const changeAccountState = (i = 0) =>{
  const stateList = ['alive','verify','unknown']
  const { account = '' } = getLoginState()
  return saveAccount(account, stateList[i])
}