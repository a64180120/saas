
/**
 * 说明: 列表信息
 * object 当前对象 vue
 * param 参数集合
 */
function delList(object, param){
    return new Promise((resolve, reject) => {
        object.$axios({
            url: 'http://10.0.45.51:8028/api/GCW/PVoucherMst/GetDetailAccount',
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
export default {
    delList
}
