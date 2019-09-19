
    /**
     * 说明: 获取收入支出表数据
     * object 当前对象 vue
     * param 参数集合
     */
  export function  IncomList(object, param){
        return new Promise((resolve, reject) => {
            object.$axios({
                url: '/PVoucherMst/GetIncomAndExpenditure',
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
     * 说明: 导出收入支出表Excel表格
     * object 当前对象 vue
     * param 参数集合
     */
    export function  IncomListToExcel(object, param){
        return new Promise((resolve, reject) => {
            object.$axios({
                url: '/PVoucherMst/PostIncomAndExpenditureExcel',
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


