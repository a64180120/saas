
/** 
 * object 当前对象 vue
 * param 参数集合
*/
export function SysUserAdd(object,param) {
  return new Promise((resolve, reject) => {
    object.$axios({
          url: "/SysUser/PostAdd",
          method: "post",
          data: param,
      }).then(res => {
          //正确
          resolve(res);               
      }).catch(error => {
          //错误
          reject(error);
      });
  });
}
/** 
 * 说明:用户信息列表的方法
 * object 当前对象 vue
 * param 参数集合
*/
export function SysUserList(object,param) {
  return new Promise((resolve, reject) => {
    object.$axios({
        url: "/SysUser/GetSysUserList",
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