import Cookies from 'js-cookie'
import Auth from "@/util/auth";

export default {
    setLang(state, data){
        if(data){
            Cookies.set('lang', data)
        } else{
            Cookies.remove('lang')
        }
        state.lang = data
    },
    addLangPack(state, data){
        if(data){
            state.langPack.push(data)
        }
    },
    setLayout(state, data){
        if(data){
            state.navbarPosition = data
        }
    },
    //全局登录sessionId的设置
    setSession(state, data){
        state.sessionId = data
        //设置缓存
        Auth.setSession(data);
    },
    // addLangPack(state, data){
    //     if(data){
    //         state.langPack.push(data)
    //     }
    // },
    // 控制loading显示隐藏
    updateLoadingStatus(state, payload) {
        console.log(payload)
        state.isLoading = payload.isLoading
    },
    //控制预算汇总弹窗
    updateRouterToBudgetcount(state,data){
        state.routerToBudgetcount=data
    },
    //控制报表汇总弹窗
    updateRouterToReportcount(state,data){
        state.routerToReportcount=data
    }

}
