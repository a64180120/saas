
/** 
 * 说明: 新增
 * object 当前对象 vue
 * param 参数集合
*/
export function SysUserAdd(object,param) {
  return new Promise((resolve, reject) => {
    object.$axios({
          url: '/SysUser/PostAdd',
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
 * 说明: 修改编辑
 * object 当前对象 vue
 * param 参数集合
*/
export function SysUserUpdate(object,param) {
    return new Promise((resolve, reject) => {
      object.$axios({
            url: '/SysUser/PostUpdate',
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
        url: "/SysUser/GetSysUserListWithRoleAndOrg",
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
 * 说明:删除
 * object 当前对象 vue
 * param 参数集合
*/
export function SysUserDelete(object,param) {
    return new Promise((resolve, reject) => {
      object.$axios({
            url: "/SysUser/PostDelete",
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
 * 说明:用户移交用户信息
 * object 当前对象 vue
 * param 参数集合
*/
export function SysUserTransferList(object,param) {
    return new Promise((resolve, reject) => {
      object.$axios({
          url: "/SysUser/GetSysUserTransferRecordsList",
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
 * 说明:密码重置
 * object 当前对象 vue
 * param 参数集合
 */
export function SysUserUpdatePassword(object,param) {
    return new Promise((resolve, reject) => {
        object.$axios({
            url: "/SysUser/PostUpdateUserPassword",
            method: "post",
            data: param
        }).then(res => {
            resolve(res)
        }).catch(error => {
            //错误
            reject(error);
        });
    });
}
/**
 * 说明:发送邀请码
 * object 当前对象 vue
 * param 参数集合
 */
export function SysUserSendInvitationCode(object,param) {
    return new Promise((resolve, reject) => {
        object.$axios({
            url: "/SysUser/GetSendInvitationCode",
            method: "get",
            data: param
        }).then(res => {
            resolve(res)
        }).catch(error => {
            //错误
            reject(error);
        });
    });
}
