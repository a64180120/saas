import httpajax from "axios";
import httpConfig from '@/util/ajaxConfig'
import qs from 'qs'
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
    GetNewsList({state, commit,rootState }, data) {
        return new Promise((resolve, reject) => {
            let base=httpConfig.getAxiosBaseConfig();
            //测试的Header

            let dbname=rootState.user.dbname;
            if(data.defultdbname){
                dbname=rootState.user.defultdbname;
                delete data.defultdbname;
            }
            

            let headconfig=httpConfig.getTestHeaderConfig(dbname);

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
    GetNewsType({ commit,rootState }, data) {
        return new Promise((resolve, reject) => {
            let base=httpConfig.getAxiosBaseConfig();
            //测试的Header
            let headconfig=httpConfig.getTestHeaderConfig(rootState.user.dbname);

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
    //提交在线留言
    MsgCommit({ commit,rootState }, data){
        return new Promise((resolve, reject) => {
            let base=httpConfig.getAxiosBaseConfig();
            //测试的Header
            let dbname=rootState.user.dbname;
            if(data.defultdbname){
                dbname=rootState.user.defultdbname;
                delete data.defultdbname;
            }
            
            let headconfig=httpConfig.getTestHeaderConfig(dbname);

            httpajax.create(base)({
                url: "/SysMessage/PostAdd",
                method:'post',
                data: qs.stringify(data),
                headers:headconfig
            }).then(res => {
                var response=JSON.parse(res.data);
                resolve(response);
            }).catch(error =>{
                console.log(error)
                reject(error)
            });
        });
        /*var data={
            /!*orgid:this.orgid,
            uid:this.uid,*!/
            infoData:this.messageOnline
        }
        const loading=this.$loading();
        this.$axios.post('/SysMessage/PostAdd',data)
            .then(res=>{
                loading.close();
                if(res.Status=='success'){
                    this.message={
                        message:'已将留言发送给工作人员,后续会与您联系!',
                        visible:true
                    }
                    this.messageOnline={
                        Description:'',
                        Phone:'',
                        Author:''
                    }
                }else{
                    this.message={
                        message:res.Msg,
                        visible:true
                    }
                }
            })
            .catch(err => {
                loading.close();
                this.$message({showClose: true, message: "提交留言失败了!", type: "error"});
            })*/
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
