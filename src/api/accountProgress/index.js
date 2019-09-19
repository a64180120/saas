import Vue from 'vue'


export function GetAllPublicRegister (param) { //获取做账进度列表信息
  return Vue.prototype.$axios('/PublicRegister/GetAllPublicRegister', { params: param })
}

export function PostAddPublicRegister (param) { //新增/修改当前组织当前年度的行政单位数
  return Vue.prototype.$axios.post('/PublicRegister/PostAddPublicRegister', param)
}


export function PostPublicRegisterList (param) { //获取做账进度明细
  return Vue.prototype.$axios.post('/PublicRegister/PostPublicRegisterList', param)
}

export function GetAllPublicRegisterToExcel (param) { //导出做账进度总表格
  return Vue.prototype.$axios('/PublicRegister/GetAllPublicRegisterToExcel', { params: param })
}
export function PostPublicRegisterListToExcel (param) { //导出做账进度明细
  return Vue.prototype.$axios.post('/PublicRegister/PostPublicRegisterListToExcel', param)
}

export function GetminiYearByOrgId (param) { //获取年份
  return Vue.prototype.$axios.get('/PublicRegister/GetminiYearByOrgId', { params: param })
}
