import Vue from 'vue'

/**
 * 数字金额 格式化
 */
Vue.filter('NumFormat', function(value) {
    if(!value) return '0.00';

    /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
    var intPart =  Number(value)|0; //获取整数部分
    var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断

    var floatPart = ".00"; //预定义小数部分
    var value2Array = value.toString().split(".");

    //=2表示数据有小数位
    if(value2Array.length == 2) {
        floatPart = value2Array[1].toString(); //拿到小数部分

        if(floatPart.length == 1) { //补0,实际上用不着
            return intPartFormat + "." + floatPart + '0';
        } else {
            return intPartFormat + "." + floatPart;
        }

    } else {
        return intPartFormat + floatPart;
    }

});
/**
 * 数字转为中文大写金额
 */
Vue.filter('toChies', function(value) {
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