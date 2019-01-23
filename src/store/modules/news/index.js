import httpajax from "axios";
import httpConfig from '@/util/ajaxConfig'
import Auth from "@/util/auth";



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
    //获取分类文章文章信息
    GetNewsList({ commit }, data) {
        return new Promise((resolve, reject) => {
            let base=httpConfig.getAxiosBaseConfig();
            //测试的Header
            let headconfig=httpConfig.getTestHeaderConfig();

            httpajax.create(base)({
                url: "/SysNews/GetSysNewsListByTypeId",
                methods: "get",
                params: data,
                headers:headconfig
            }).then(res => {
                var response=JSON.parse(res.data);
                resolve(response);
            }).catch(error =>{
                console.log(error)
                reject(error)
            });
        });
    },
    //获取文章分类
    GetNewsType({ commit }, data) {
        return new Promise((resolve, reject) => {
            let base=httpConfig.getAxiosBaseConfig();
            //测试的Header
            let headconfig=httpConfig.getTestHeaderConfig();

            httpajax.create(base)({
                url: "/SysNews/GetSysNewsTypeList",
                methods: "get",
                params: data,
                headers:headconfig
            }).then(res => {
                var response=JSON.parse(res.data);
                resolve(response);
            }).catch(error =>{
                console.log(error)
                reject(error)
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
