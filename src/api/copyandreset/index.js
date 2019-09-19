import Vue from 'vue'

export function GetOrganizeBackupList (param) {  //获取自动设置
  return Vue.prototype.$axios.get('OrganizeBackup/GetOrganizeBackupList', { params: param })
}

export function GetUpdateOrganizeAutoSave (param) {  //更新自动设置
  return Vue.prototype.$axios.get('OrganizeBackup/GetUpdateOrganizeAutoSave', { params: param })
}

export function GetOrganizeBackupReName (param) {//重命名
  return Vue.prototype.$axios.get('/OrganizeBackup/GetOrganizeBackupReName', { params: param })
}


export function GetDeleteOrganizeBackup (param) {//删除备份
  return Vue.prototype.$axios.get('/OrganizeBackup/GetDeleteOrganizeBackup', { params: param })
}


export function PostAddBackUp (param) {//备份数据
  return Vue.prototype.$axios.post('/OrganizeBackup/PostAddBackUp', param)
}


export function RecoverDataBackup (param) {//恢复数据
  return Vue.prototype.$axios.post('/OrganizeBackup/RecoverDataBackup', param)
}