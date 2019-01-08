
/**
 * 说明:科目列表
 * object 当前对象 vue
 * param 参数集合
*/
export function SubjectList(object,param) {
  return new Promise((resolve, reject) => {
    object.$axios({
        url: "/PSubject/PostPSubjectQueryList",
        method: 'post',
        data: param
    }).then(res => {
        resolve(res.Data)
    }).catch(error => {
        //错误
        reject(error);
    });
  });
}


/**
 * 说明:科目列表
 * object 当前对象 vue
 * param 参数集合
*/
export function SubjectList2(object,param) {
    return new Promise((resolve, reject) => {
      object.$axios({
          url: "/PSubject/GetPSubjectList",
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
 * 说明: 新增科目
 * object 当前对象 vue
 * param 参数集合
*/
export function SubjectAdd(object,param) {
    return new Promise((resolve, reject) => {
      object.$axios({
            url: '/PSubject/PostAdd',
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
 * 说明: 修改科目
 * object 当前对象 vue
 * param 参数集合
*/
export function SubjectUpdate(object,param) {
    return new Promise((resolve, reject) => {
      object.$axios({
            url: '/PSubject/PostUpdate',
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
 * 说明:删除科目
 * object 当前对象 vue
 * param 参数集合
*/
export function SubjectDelete(object,param) {
    return new Promise((resolve, reject) => {
      object.$axios({
            url: "/PSubject/PostDelete",
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
