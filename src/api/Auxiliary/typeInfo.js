/** 
 * 说明: 获取辅助类型列表和第一个辅助类型对应的辅助类型基础数据列表
 * object 当前对象 vue
 * param 参数集合
*/
export function AuxiliaryTypeList(object,param) {
  return new Promise((resolve, reject) => {
    object.$axios({
        url: "/PVoucherAuxiliaryType/GetVoucherAuxiliaryTypeList",
        method: 'get',
        params: param
    }).then(res => {
        resolve(res)
    }).catch(error => {
        //错误
        reject(error);
    });
  });
}

/** 
 * 说明: 获取辅助类型列表
 * object 当前对象 vue
 * param 参数集合
*/
export function AuxiliaryTypeListNo(object,param) {
    return new Promise((resolve, reject) => {
      object.$axios({
          url: "/PVoucherAuxiliaryType/GetVoucherAuxiliaryType",
          method: 'get',
          params: param
      }).then(res => {
          resolve(res)
      }).catch(error => {
          //错误
          reject(error);
      });
    });
}