/**
 * Created by wfm on 18/11/24.
 */

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}
/**
 * 判断是否为空
 */
export function validatenull(val) {
    if (typeof val === "boolean") {
        return false;
    }
    if (val instanceof Array) {
        if (val.length === 0) return true;
    } else if (val instanceof Object) {
        if (JSON.stringify(val) === "{}") return true;
    } else {
        if (
            val === "null" ||
            val == null ||
            val === "undefined" ||
            val === undefined ||
            val === ""
        )
            return true;
        return false;
    }
    return false;
}

/**
 * 判断手机号码是否正确
 */
export function isvalidatemobile(phone) {
    const list = [];
    let result = true;
    let msg = "";
    var isPhone = /^0\d{2,3}-?\d{7,8}$/;
    // 增加134 减少|1349[0-9]{7}，增加181,增加145，增加17[678]
    // const isMob = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|14[57][0-9]{8}|17[3678][0-9]{8})$/
    if (!validatenull(phone)) {
        if (phone.length === 11) {
            if (isPhone.test(phone)) {
                msg = "手机号码格式不正确";
            } else {
                result = false;
            }
        } else {
            msg = "手机号码长度不为11位";
        }
    } else {
        msg = "手机号码不能为空";
    }
    list.push(result);
    list.push(msg);
    return list;
}

/**
 * 让字符串或数字如何尾数能自动加1
 */
export function dealAddString(str) {
    return str.replace(/\d+$/, function(a) {
        var o = "",
            l = 0,
            i = (l = a.length);
        while (i) {
            o += "0";
            i--;
        }
        return (o + (parseInt(a) + 1)).slice(l * -1);
    });
}

export function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

//日期格式化
export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + "";
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
            );
        }
    }
    return fmt;
}
