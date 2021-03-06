
var fs = require('fs');

Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, //month
		"d+" : this.getDate(), //day
		"h+" : this.getHours(), //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
		"S" : this.getMilliseconds() //millisecond
	}

	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for(var k in o) {
		if(new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
} 

exports.fileBase64Encode = function(filePath) {
    var bitmap = fs.readFileSync(filePath);
    return new Buffer(bitmap).toString("base64");
};

exports.fileBase64Decode = function(base64str, filePath) {
    var bitmap = new Buffer(base64str, "base64");
    fs.writeFileSync(filePath, bitmap);
    //console.log('******** File created from base64 encoded string ********');
};

//格式化一个字符串
exports.format = function() {
	var str = arguments[0];

	for(var i = 1; i < arguments.length; i++) {
		str = str.replace("{" + (i - 1).toString() + "}", arguments[i]);
	}
	
	return str;
};

//防注入检测
exports.sqlStrValid = function(str) {
	str = str + "";

	var re = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
	if(re.test(str))
		return false;
	
	return str;
};

//下面是这个项目自有的

//生成一个输出数据的对象
exports.outputJsonStr = function(ok, message, cmd, data) {
	
	var outputStrObj = {};
	outputStrObj.ok = ok;

	if(message != undefined && message != null)
		outputStrObj.message = message;
	
	if(cmd != undefined && cmd != null)
		outputStrObj.cmd = cmd;

	if(data != undefined && data != null)
		outputStrObj.data = data;
	
	return JSON.stringify(outputStrObj);
};

exports.sqlValid = function(connection, str, errorStr) {
	str = this.sqlStrValid(str);
	if(!str) {
		var outputStr = this.outputJsonStr(0, errorStr);
		connection.sendUTF(outputStr);
		return false;
	}
	return str;
};
