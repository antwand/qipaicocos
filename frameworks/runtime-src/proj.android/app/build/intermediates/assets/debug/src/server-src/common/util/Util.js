/**
 * util 工具类
 * @author antwand@sina.com
 * @type {{}}
 */
var Util = {};


/**
  格式化
 * @param num
 */
Util.formatNumber = function(num){
    var str = num;
    if(num > 10000){
        str  = (num/10000).toFixed(1) +"W";
    }else if(num > 1000){
        //str  = (num/1000).toFixed(1) +"K";
    }

    return str;
}

/**
 * proxy 绑定this
 */
Util.proxy = function(fun,that){
    return function(){
        fun.apply(that,arguments);
    }
}


//去除空格
String.prototype.Trim = function() {
    return this.replace(/\s+/g, "");
}

//去除换行
Util.ClearBr = function(key) {
    key = key.replace(/<\/?.+?>/g,"");
    key = key.replace(/[\r\n]/g, "");
    return key;
}

//去除左侧空格
Util.LTrim = function(str) {
    return str.replace(/^\s*/g,"");
}

//去右空格
Util.RTrim= function (str) {
    return str.replace(/\s*$/g,"");
}

//去掉字符串两端的空格
Util.trim= function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

//去除字符串中间空格
Util.CTim= function (str) {
    return str.replace(/\s/g,'');
}

//是否为由数字组成的字符串
Util.is_digitals= function (str) {
    var reg=/^[0-9]*$/; //匹配整数
    return reg.test(str);
}



if(module)
    module.exports = Util;