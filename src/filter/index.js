import Vue from 'vue'

/**
 * 数字金额 千分位格式化
 */
Vue.filter('NumFormat', function(value, decimals = 2, decPoint = '.', thousandsSep = ',') {
    if(!value) return '0.00';

    value = (value + '').replace(/[^0-9+-Ee.]/g, '')
    
    let n = !isFinite(+value) ? 0 : +value
    let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    let s = ''
    let toFixedFix = function (n, prec) {
      let k = Math.pow(10, prec)
      return '' + Math.ceil(n * k) / k
    }
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    let re = /(-?\d+)(\d{3})/
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2')
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || ''
      s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)

});
/**
 * 数字转为中文大写金额
 */
Vue.filter('NumtoCHN', function(value) {
    var values=value.toString()
    let len=values.length//统计出长度
    let arr=[];
    
    let chin_list=['零','壹','贰','叁','肆','伍','陆','柒','捌','玖']//所有的数值对应的汉字
    
    let chin_lisp=['仟','佰','拾','亿','仟','佰','拾','万','仟','佰','拾']//进制
    
    for(let i=0;i<len;i++){
        arr.push(parseInt(values[i]));		//输入的数据按下标存进去   存进去的只是数字
        arr[i]=chin_list[arr[i]]			//是根据我们输入的输入的数字，对应着我们的chin_list这个数组
    }//123['壹','佰','贰','拾','叁']
    
    for(let i=len-1,j=1;i>0;i--){//i =2	1		//倒序		为了添加进制，方便我们去观看
        arr.splice(i,0,chin_lisp[chin_lisp.length-j++])	//j=2
    }
    //console.log(arr)
    
    arr=arr.join('')
    if(len>=1){
        arr+='元整'
    }
    return arr
});