/** 
 * 说明: 新增保存
 * object 当前对象 vue
 * param 参数集合
*/
export function SysOrgAdd(object,param) {
    return new Promise((resolve, reject) => {
      object.$axios({
        url: '/SysOrganize/PostAdd',
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
 * 说明: 修改保存
 * object 当前对象 vue
 * param 参数集合
*/
export function SysOrgUpdate(object,param) {
  return new Promise((resolve, reject) => {
    object.$axios({
      url: '/SysOrganize/PostUpdate',
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
 * 说明: 列表信息
 * object 当前对象 vue
 * param 参数集合
*/
export function SysOrgList(object,param) {
  return new Promise((resolve, reject) => {
    object.$axios({
      url: '/SysOrganize/GetSysOrganizeList',
      method: 'get',
      params: param
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
 * 说明: 删除组织
 * object 当前对象 vue
 * param 参数集合
*/
export function SysOrgDelete(object,param) {
  return new Promise((resolve, reject) => {
    object.$axios({
      url: '/SysOrganize/PostDelete',
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
 * 说明: 组织信息
 * object 当前对象 vue
 * param 参数集合
*/
export function SysOrgModel(object,param) {
  return new Promise((resolve, reject) => {
    object.$axios({
      url: '/SysOrganize/GetSysOrganize',
      method: 'get',
      params: param
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
 * 说明: 组织信息
 * object 当前对象 vue
 * param 参数集合
 */
export function AllAreaSysOrgModel(object,param) {
    return new Promise((resolve, reject) => {
        object.$axios({
            url: '/SysOrganize/GetAllAreaSysOrganize',
            method: 'get',
            params: param
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
 * 说明: 上传附件
 * object 当前对象 vue
 * param 参数集合
*/
export function SysOrgUploadFile(object,param) {
  return new Promise((resolve, reject) => {
    object.$axios({
      url: '/SysOrganize/PostUploadFile',
      method: "post",
      data: param
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
 * 说明: 修改保存并保存记录
 * object 当前对象 vue
 * param 参数集合
 */
export function SysOrgUpdateAndRecord(object,param) {
    return new Promise((resolve, reject) => {
        object.$axios({
            url: '/SysOrganize/PostUpdateAndRecord',
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
