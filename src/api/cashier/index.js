import Vue from 'vue'
 let vm =new Vue();
//修改日记账列表
export function cashierUpdate(vm,data){
    return new Promise((resolve,reject)=>{
        const loading=vm.$loading();
        vm.$axios.post('Cashier/PostSaveCashierList',data)
            .then(res=>{
                loading.close();
                resolve(res);
            })
            .catch(err=>{
                loading.close();
                reject(err);
            })
    })
}


//获取日记账列表
export function getDataList(vm,data){
    return new Promise((resolve,reject)=>{
        const loading=vm.$loading();
        vm.$axios.get('Cashier/GetCashierList',{params:data})
            .then(res=>{
                loading.close();
                resolve(res);
            })
            .catch(err=>{
                loading.close();
                reject(err);
            })
    })
}


//获取账户列表
export function getCashierAccount(vm,data){
    return new Promise((resolve,reject)=>{
        const loading=vm.$loading();
        vm.$axios.get('CashierAccount/GetCashierAccount',{params:data})
            .then(res=>{
                loading.close();
                resolve(res);
            })
            .catch(err=>{
                loading.close();
                reject(err);
            })
    })
}

////获取凭证科目列表
export function getSubject(vm,data){
    return new Promise((resolve,reject)=>{
        const loading=vm.$loading();
        vm.$axios.get('/PSubject/GetPSubjectListByOrgId',{params:data})
            .then(res=>{
                loading.close();
                resolve(res);
            })
            .catch(err=>{
                loading.close();
                reject(err);
            })
    })
}

////获取凭证摘要列表
export function getAbstract(vm){
    return new Promise((resolve,reject)=>{
        const loading=vm.$loading();
        vm.$axios.get('/PAbstractTem/GetAbstractTem')
            .then(res=>{
                loading.close();
                resolve(res);
            })
            .catch(err=>{
                loading.close();
                reject(err);
            })
    })
}


