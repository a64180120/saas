
//模板格式导出选中的凭证
export function  modelExportByPhid(object, param){
 
  return  object.$axios.post('/PVoucherMst/PostVoucherListByPhids',param)
}

//模板格式按时间导出凭证

export function  modelExportByDate(object, param){
  return  object.$axios.get('/PVoucherMst/GetVoucherList',{params:param})
}



//插入凭证

export function  pushVoucher(object, param){
  return  object.$axios.post('/PVoucherMst/PostNewCustomizeRebuilder',param)
}