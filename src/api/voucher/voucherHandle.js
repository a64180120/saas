const api= {
    voucherAudit(vm, param) {
        return new Promise((resolve, reject) => {
            vm.$axios.post('PVoucherMst/PostAudit', param)
                .then(res => {
                    console.log(res)
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
}
export default {
    api
}
