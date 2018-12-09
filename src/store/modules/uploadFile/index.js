import axios from "axios";
import ajaxhttp from '@/util/ajaxConfig' //自定义ajax头部配置*****


//状态
const state = {

};

//计算获取取新数据
const getters = {

};

//操作state(同步)
const mutations = {

};

//执行一些方法(异步)
const actions = {

    // 上传附件
    Orgupload({ commit }, data) {
        return new Promise((resolve, reject) => {
            let baseheader=ajaxhttp.header;
            let base=ajaxhttp.base;

            let config_header = { "Content-Type": "multipart/form-data" };
            var new_header = Object.assign({},config_header, baseheader);
            axios.create(base).post('/SysOrganize/PostUploadFile', data, { headers:new_header }).then(res => {
                var response=JSON.parse(res.data);
                resolve(response);

        　　}).catch((error) =>{
                //错误
                reject(error);
            });
        });
    },
    // 凭证上传附件
    Voucherupload({ commit }, data) {
        return new Promise((resolve, reject) => {
            let baseheader=ajaxhttp.header;
            let base=ajaxhttp.base;

            let config_header = { "Content-Type": "multipart/form-data" };
            var new_header = Object.assign({},config_header, baseheader);
            axios.create(base).post('/PVoucherAttachment/PostUploadFile', data, { headers:new_header }).then(res => {
                var response=JSON.parse(res.data);
                resolve(response);

        　　}).catch((error) =>{
                //错误
                reject(error);
            });
        });
    },
    //下载附件
    download({ commit }, data){
        return new Promise((resolve, reject) => {
            resolve(res);
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
