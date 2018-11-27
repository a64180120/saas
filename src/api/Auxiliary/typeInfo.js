/** 
 * 说明: 辅助项 类别列表
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