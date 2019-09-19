import Cookies from "js-cookie";
import axios from "@/util/ajax";
import Auth from "@/util/auth";
import httpajax from "axios";
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
import qs from 'qs'
import { uuid } from "@/util/validate";
import md5 from "js-md5";


//状态
const state = {
  token: "",
  appKey: "",
  appSecret: "",
  //区域数据库
  dbname: '',
  //默认数据库
  defultdbname: 'NG0001',
  //用户ID
  userid: "",
  //组织ID
  orgid: "",
  //组织代码
  orgcode: '',
  //组织名称
  orgName: '',
  //左侧菜单权限
  navList: [],
  // 用户名
  username: '',
  //EmpowerInfo 判断是否是试用用户
  EmpowerInfo: '',
  //登录的ID--[移到rootState根的state]
  //sessionId:'',
  //该用户可用的邀请码
  invitationCode: '',
  //开始记账时间
  startYear: '',
  //角色信息
  roleInfo: [],
  //组织信息
  curOrg: '',
  //按钮权限
  Roleauthorize: '',
  //组织注册状态
  orgNature: '',
  //自动备份设置
  autoSetting: {
    BuySave: 1,//结账
    BackBuySave: 1,//反结账
    BackInitSave: 1,//反初始化
    RecallSave: 1,//恢复
  }
};

//计算获取取新数据
const getters = {
  getDbName: (state) => {
    return state.dbname
  }
};

//操作state(同步)
const mutations = {
  //菜单
  setNavList: (state, data) => {
    if (data) {
      state.navList = data;
      Auth.setMenuStatus(data);
    } else {
      Auth.removeMenuStatus();
    }
  },
  //token
  setToken: (state, data) => {
    if (data) {
      //console.log(data)
      Auth.setToken(data);
      state.token = data.token;
      state.appKey = data.appKey;
      state.appSecret = data.appSecret;
      //区域数据库，token数据获取
      state.dbname = data.dbname;
      //默认数据
      state.defultdbname = data.dbname;
    } else {
      Auth.removeToken();
    }
  },
  //用户信息 包括 userInfo orgInfo
  setUserInfo: (state, data) => {
    if (data && typeof data === 'object') {
      data.isLogin = true;
      Auth.setUserInfoData(data);
      state.userid = data.userInfo.PhId;
      state.orgid = data.orgInfo.PhId;
      state.orgcode = data.orgInfo.EnCode;
      state.orgNature = data.orgInfo.OrgNature;
      state.orgName = data.orgInfo.OrgName;
      state.curOrg = data.orgInfo;
      state.startYear = data.orgInfo.StartYear;
      state.username = data.userInfo.RealName;
      state.EmpowerInfo = data.orgInfo.EmpowerInfo;
      state.invitationCode = data.orgInfo.InvitationCode;
      state.roleInfo = data.roleInfo;
      state.autoSetting.BackBuySave = data.orgInfo.BackBuySave;
      state.autoSetting.BackInitSave = data.orgInfo.BackInitSave;
      state.autoSetting.BuySave = data.orgInfo.BuySave;
      state.autoSetting.RecallSave = data.orgInfo.RecallSave;

    } else {
      Auth.removeUserInfoData();
    }
  },
  //页面按钮信息
  setRoleauthorize: (state, data) => {
    state.Roleauthorize = data;
  },
  //设置数据库的默认信息
  setDbName: (state, data) => {
    if (data) {
      console.log(data)
      Auth.setDBBase(data);
      //区域数据库修改
      state.dbname = data.dbname;
    } else {
      Auth.removeDBBase();
    }
  },
  //设置数据备份自动设置参数
  setAutoSetting: (state, data) => {
    //修改缓存
    let user = JSON.parse(window.sessionStorage.getItem('user'))
    user.content.orgInfo.BackBuySave = data.BackBuySave;
    user.content.orgInfo.BackInitSave = data.BackInitSave;
    user.content.orgInfo.BuySave = data.BuySave;
    user.content.orgInfo.RecallSave = data.RecallSave;
    window.sessionStorage.setItem('user', JSON.stringify(user))
    //修改vuex
    state.autoSetting.BackBuySave = data.BackBuySave;
    state.autoSetting.BackInitSave = data.BackInitSave;
    state.autoSetting.BuySave = data.BuySave;
    state.autoSetting.RecallSave = data.RecallSave;

  }
};

//执行一些方法(异步)
const actions = {
  // 获取Token
  getToken ({ commit, state }, parameters) {
    return new Promise((resolve, reject) => {
      console.log('window.global:' + window.global.baseUrl)
      let base = httpConfig.getAxiosBaseConfig();
      let url = httpConfig.baseurl;

      httpajax.create({
        baseURL: base.baseURL
      }).get('/SysToken/GetToken', {
        params: {
          token: 'g6c'
        },
        headers: {
          'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
          'Accept': "application/json; charset=utf-8"
        }
      }).then(res => {
        if (res.status === 200) {
          var response = JSON.parse(res.data);
          console.log(response)
          var object = {
            token: response.Token,
            appKey: response.AppKey,
            appSecret: response.AppSecret,
            dbname: response.DBName,
            //sessionId:uuid()
          };
          //用户信息缓存
          commit("setToken", object);
        } else {
          alert('网络不通:' + url + ',请检查服务接口网络！.....')
        }

        resolve(res);

      }).catch((error) => {
        console.log(error)
        //错误
        reject(error);
      });
    });
  },
  //获取页面按钮权限
  GetAllRoleauthorize ({ state, commit, dispatch }, orgInfo) {
    return new Promise((resolve, reject) => {
      let base = httpConfig.getAxiosBaseConfig();
      //测试的Header
      let headconfig = httpConfig.getTestHeaderConfig(state.dbname);
      httpajax.create(base)({
        url: "/SysRole/GetAllRoleauthorizeByUserAndOrg",
        method: "get",
        params: orgInfo,
        headers: headconfig
      }).then(res => {
        var response = JSON.parse(res.data);
        if (response.Status === "success") {

          var role = JSON.parse(response.Data.replace(/\n/g, "\\n").replace(/\r/g, "\\r"))
          commit("setRoleauthorize", role);
        }

        resolve(response);

      }).catch(error => {
        console.log(error)
        reject(error)
      });
    });
  },
  // 业务用户登录
  loginByPhone ({ state, commit, rootState }, userInfo) {
    return new Promise((resolve, reject) => {

      let base = httpConfig.getAxiosBaseConfig();
      //测试的Header
      let headconfig = httpConfig.getTestHeaderConfig(state.dbname);
      var sessionId = rootState.sessionId; //sessionid

      if (!sessionId) {
        sessionId = Auth.getSession();
      }

      var data = {
        uname_login: userInfo.name,
        orgid: userInfo.orgid,
        password: md5(userInfo.password),
        sessionId: sessionId
      };

      //重新登录，清除所有缓存
      //Auth.removeMenuStatus();
      //Auth.removeUserInfoData();

      httpajax.create(base)({
        url: "/SysUser/PostLogin",
        method: "post",
        data: qs.stringify(data),
        headers: headconfig
      }).then(res => {
        var response = JSON.parse(res.data);
        if (response.Status === "success") {
          var user = response.Data;
          commit("setUserInfo", user);
        }
        resolve(response);

      }).catch(error => {
        console.log(error)
        reject(error)
      });
    });
  },
  // 验证码信息
  GetVerifycode ({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      let base = httpConfig.getAxiosBaseConfig();

      httpajax.create({
        baseURL: base.baseURL
      }).get('/SysToken/GetSecurityCode', {
        params: params
        // headers:{
        //     'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
        //     'Accept': "application/json; charset=utf-8"
        // }
      }).then(res => {

        resolve(res);

      }).catch((error) => {
        console.log(error)
        //错误
        reject(error);
      });
    });
  },
  // 获取当前用户的组织信息
  GetOrgByUser ({ commit, state }, parameters) {
    return new Promise((resolve, reject) => {
      let base = httpConfig.getAxiosBaseConfig();
      //测试的Header
      let headconfig = httpConfig.getTestHeaderConfig(state.dbname);

      httpajax.create(base)({
        url: "/SysUser/PostOrgByUNameOrUPhone",
        method: "post",
        data: qs.stringify(parameters),
        headers: headconfig
      }).then(res => {
        var response = JSON.parse(res.data);
        resolve(response);
      }).catch(error => {
        console.log(error)
        reject(error)
      });
    });
  },

  // 获取用户信息
  GetInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios({
        url: "/SysUser/GetUserInfo",
        method: "get",
        params: {
          uid: state.userid,
          orgid: state.orgid
        }
      }).then(res => {
        console.log('用户缓存信息');
        console.log(res)
        if (res.Status === "success") {
          //用户信息缓存
          commit("setUserInfo", res.Data);
        }
        resolve(res);
      }).catch(error => {
        console.log(error)
        reject(error)
      });
    });
  },

  // 退出
  logout ({ commit }) {

    return new Promise(resolve => {
      //清除缓存
      commit("setToken", "");  //token
      commit("setDbName", "");  //数据库的数据缓存清除
      commit("setUserInfo", ""); //用户信息
      commit('setNavList', ''); //菜单
      //若需要在全局命名空间内分发 action 或提交 mutation，将 { root: true } 作为第三参数传给 dispatch 或 commit 即可
      commit('tagNav/delAllTagNav', '', { root: true })

      //清除配置文件
      commit('Pconfig/setPConfig', '', { root: true })

      resolve();
    });
  },
  // 切换组织
  turnOrgClearInfo ({ commit }) {

    return new Promise(resolve => {
      //清除缓存
      // commit("setToken", "");  //token

      commit("setUserInfo", ""); //用户信息
      commit('setNavList', ''); //菜单
      //若需要在全局命名空间内分发 action 或提交 mutation，将 { root: true } 作为第三参数传给 dispatch 或 commit 即可
      commit('tagNav/delAllTagNav', '', { root: true })

      //清除配置文件
      commit('Pconfig/setPConfig', '', { root: true })

      resolve();
    });
  },
  // 重新获取用户信息及Token
  // TODO: 这里不需要提供用户名和密码，实际中请根据接口自行修改
  relogin ({ dispatch, commit, state }) {
    return new Promise(resolve => {
      // 根据Token进行重新登录
      let tokenInfo = Auth.getToken(),
        dbIbfo = Auth.getDBBase(),
        userInfo = Auth.getUserInfoData(),
        menuInfo = Auth.getMenuStatus(),
        config = Auth.getPConfigStatus();

      // 重新登录时校验Token是否存在，若不存在则获取

      //token
      if (tokenInfo) {
        //设置用户 state ,重新加载用户缓存
        commit("setToken", tokenInfo);
      }

      //dbIbfo
      if (dbIbfo) {
        //设置用户 state ,重新加载用户缓存
        commit("setDbName", dbIbfo);
      }
      //用户
      if (userInfo) {
        //设置用户 state ,重新加载用户缓存
        commit("setUserInfo", userInfo);
      }
      //菜单
      if (menuInfo) {
        //设置用户 state ,重新加载用户缓存
        commit("setNavList", menuInfo);
      }

      //配置信息
      if (config) {
        //设置用户 state ,重新加载用户缓存
        commit("Pconfig/setPConfig", config, { root: true });
      }
      resolve();
    });
  },

  // 获取该用户的菜单列表
  getNavList ({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      //let base=httpConfig.getAxiosBaseConfig();
      //测试的Header
      //let headconfig=httpConfig.getTestHeaderConfig(state.dbname);

      axios({
        url: "/SysMenu/GetMenuList",
        methods: "get",
        params: {
          uid: data.userid || state.userid,
          orgid: data.orgid || state.orgid
        }
      }).then(res => {
        console.log(res)
        //数据序列化
        commit("setNavList", res || []);
        resolve(res);
      }).catch(error => {
        console.log(error)
        reject(error)
      });
    });
  },

  // 将菜单列表扁平化形成权限列表
  getPermissionList ({ commit, state }, data) {
    return new Promise(resolve => {
      let permissionList = [];
      // 将菜单数据扁平化为一级
      function flatNavList (arr) {
        for (let v of arr) {
          if (v.child && v.child.length) {
            flatNavList(v.child);
          } else {
            if (v.path) {
              permissionList.push(v);
            }
          }
        }
      }

      flatNavList(data);
      resolve(permissionList);
    });
  },

  /**
   * 组织切换
   * data -组织信息
   *  */
  reloginByOrg ({ dispatch, commit, state }, data) {
    return new Promise((resolve, reject) => {

      axios({
        url: "/SysUser/PostReLoadInfo",
        method: "post",
        data: {
          uid: data.uid,
          orgid: data.orgid
        }
      }).then(res => {

        if (res.Status === "success") {
          var user = res.Data;
          //用户信息缓存
          commit("setUserInfo", user);
        }
        resolve(res);
      }).catch(error => {
        console.log(error)
        reject(error)
      });
    });
  },

  /**
   * 判断当前账号 所在的区域 和数据库的名称
   * data -当前账号
   *  */
  CheckAccount ({ dispatch, commit, state }, data) {

    return new Promise((resolve, reject) => {
      let token = Auth.getToken();
      //没有时间的限制
      let base = httpConfig.getAxiosBaseConfigUncontrol();
      //测试的Header
      let headconfig = httpConfig.getTestHeaderConfig(state.defultdbname);

      //发送请求
      httpajax.create(base)({
        url: "/SysDBbase/PostCheckAccount",
        method: "post",
        data: qs.stringify({ uname_login: data.uname_login }),
        headers: headconfig
      }).then(res => {
        var response = JSON.parse(res.data);
        resolve(response);
      }).catch(error => {
        console.log(error)
        reject(error)
      });
    });
  },

  /**
   * 获取当前数据库的区域和数据库的关系（所有）
   *  */
  SysDBbaseList ({ dispatch, commit, state }) {

    return new Promise((resolve, reject) => {
      //let token = Auth.getToken();
      //没有时间的限制
      let base = httpConfig.getAxiosBaseConfigUncontrol();
      //测试的Header
      let headconfig = httpConfig.getTestHeaderConfig(state.defultdbname);

      //发送请求
      httpajax.create(base)({
        url: "/SysDBbase/GetSysDBbaseListAll",
        method: "get",
        params: {},
        headers: headconfig
      }).then(res => {
        var response = JSON.parse(res.data);
        resolve(response);
      }).catch(error => {
        console.log(error)
        reject(error)
      });
    });
  },

  /**
   * 新增用户与数据库的关系
   * data-关系数组
   *  */
  SaveUserDBInsert ({ dispatch, commit, state }, data) {

    return new Promise((resolve, reject) => {
      let token = Auth.getToken();
      //没有时间的限制
      let base = httpConfig.getAxiosBaseConfigUncontrol();
      //测试的Header
      let headconfig = httpConfig.getTestHeaderConfig(token.dbname);

      //发送请求
      httpajax.create(base)({
        url: "/SysDBbase/PostSaveUserDBInsert",
        method: "post",
        data: qs.stringify(data),
        headers: headconfig
      }).then(res => {
        var response = JSON.parse(res.data);
        resolve(response);
      }).catch(error => {
        console.log(error)
        reject(error)
      });
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
