
  /** 
   * 说明: 获取辅助项详细列表
   * object 当前对象 vue
   * param 参数集合
  */
  export function AuxiliaryList(object,param) {
      return new Promise((resolve, reject) => {
        object.$axios({
            url: "/PVoucherAuxiliaryType/GetAuxiliaryQueryList",
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