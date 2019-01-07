import axios from "axios";
import httpConfig from '@/util/ajaxConfig'



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
            let baseheader=httpConfig.getHeaderConfig();
            let base=httpConfig.getAxiosBaseConfig();

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
            let baseheader=httpConfig.getHeaderConfig();
            let base=httpConfig.getAxiosBaseConfig();

            let config_header = { "Content-Type": "multipart/form-data" };
            var new_header = Object.assign({},config_header, baseheader);
            console.log(data)
            axios.create(base).post('/PVoucherAttachment/PostUploadFile', data, { headers:new_header }).then(res => {
                var response=JSON.parse(res.data);
                console.log(response)
                resolve(response);

        　　}).catch((error) =>{
                //错误
                reject(error);
            });
        });
    },
    // 凭证导入excel
    Excelupload({ commit }, data) {
        return new Promise((resolve, reject) => {
            let baseheader=httpConfig.getHeaderConfig();
            let base=httpConfig.getAxiosBaseConfig();

            let config_header = { "Content-Type": "multipart/form-data" };
            var new_header = Object.assign({},config_header, baseheader);
            console.log(data)
            axios.create(base).post('/PVoucherMst/PostUploadFile', data, { headers:new_header }).then(res => {
                var response=JSON.parse(res.data);
                console.log(response)
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
    },
    // 上传封面图片附件
    Newsupload({ commit }, data) {
        return new Promise((resolve, reject) => {
            let baseheader=httpConfig.getHeaderConfig();
            let base=httpConfig.getAxiosBaseConfig();

            let config_header = { "Content-Type": "multipart/form-data" };
            var new_header = Object.assign({},config_header, baseheader);
            axios.create(base).post('/SysNews/PostUploadFile', data, { headers:new_header }).then(res => {
                var response=JSON.parse(res.data);
                resolve(response);

        　　}).catch((error) =>{
                //错误
                reject(error);
            });
        });
    },
    // 上传图片管理附件
    PicUpload({ commit }, data) {
        return new Promise((resolve, reject) => {
            let baseheader=httpConfig.getHeaderConfig();
            let base=httpConfig.getAxiosBaseConfig();

            let config_header = { "Content-Type": "multipart/form-data" };
            var new_header = Object.assign({},config_header, baseheader);
            axios.create(base).post('/SysPicture/PostAddSysPicture', data, { headers:new_header }).then(res => {
                var response=JSON.parse(res.data);
                resolve(response);

        　　}).catch((error) =>{
                //错误
                reject(error);
            });
        });
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
