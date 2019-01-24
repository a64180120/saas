/** 
 * 说明: 获取角色信息列表
 * object 当前对象 vue
 * param 参数集合
*/
export function SysRoleList(object,param) {
    return new Promise((resolve, reject) => {
        object.$axios({
          url: "/SysRole/GetSysRoleList",
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
 * 说明: 获取无超级管理员的角色信息列表
 * object 当前对象 vue
 * param 参数集合
 */
export function SysRoleListNoAdmin(object,param) {
    return new Promise((resolve, reject) => {
        object.$axios({
            url: "/SysRole/GetSysRoleListNoAdmin",
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
