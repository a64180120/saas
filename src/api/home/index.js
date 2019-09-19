export function getOtherSetting(vm,param){
    return new Promise((resolve,reject)=>{
        vm.$axios.get('SysMessage/GetSysSettingMessage',{ params: param})
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
}

