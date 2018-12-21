import axios from "@/util/ajax";
import Auth from "@/util/auth";


//状态
const state = {
    //会计期年度
    jyear: "",
    //当前会计期
    jmonth: "",
    //账务初始标志
    zwinite:'' ,
    //科目代码层级
    subjectlength:'' ,
};

//计算获取取新数据
const getters = {

};

//操作state(同步)
const mutations = {

    //账务的基础配置信息
    setPConfig:(state, data) => {
        if (data) {
            state.jyear = data.JYear;
            state.jmonth = data.JAccountPeriod;
            state.zwinite = data.ZwInited;
            var slength= data.JSubjectCodeLength1+";"+
                         data.JSubjectCodeLength2+";"+
                         data.JSubjectCodeLength3+";"+
                         data.JSubjectCodeLength4+";"+
                         data.JSubjectCodeLength5+";"+
                         data.JSubjectCodeLength6+";"+
                         data.JSubjectCodeLength7+";"+
                         data.JSubjectCodeLength8+";"+
                         data.JSubjectCodeLength9+";"+
                         data.JSubjectCodeLength10;

            state.subjectlength = slength;
            Auth.setPConfigStatus(data);
        }else{
            Auth.removePConfigStatus();
        }
    },
    //组织系统配置信息
    setOrgConfig:(state, data) => {
        if (data) {
            state.navList = data;
            Auth.setMenuStatus(data);
        }else{
            Auth.removeMenuStatus();
        }
    },

};

//执行一些方法(异步)
const actions = {

    //获取当前账务的基础配置信息
    getBusinessConfig({ commit, state }, parameters){
        return new Promise((resolve, reject) => {

            axios({
                url: "/PBusinessConfig/GetPBusinessConfigByOrg",
                methods: "get",
                params: {
                    uid:parameters.userid,
                    orgid:parameters.orgid,
                    Ryear:parameters.year   //会计年度
                }
            }).then(res => {
                if (res &&res.Status === "success") {
                    //用户信息缓存
                    
                    commit("setPConfig", res.Data);
                }
                resolve(res);
            }).catch(error =>{
                console.log(error)
                reject(error)
            });
        });
    },
    //获取当前组织系统配置信息
    getOrganizeConfig({ commit, state }){
        return new Promise((resolve, reject) => {

            axios({
                url: "/POrganizeConfig/GetOrganizeConfigList",
                methods: "get",
                params: {
                    uid:state.userid,
                    orgid:state.orgid
                }
            }).then(res => {

                commit("setOrgConfig", res);
                resolve(res);
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
