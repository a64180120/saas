import saasMessage from "./message.vue"
 
const message={
    install:function(Vue){
        Vue.component('message',saasMessage)
    }
}

export default message