function isPhone(str) {
  var reg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/;
  return reg.test(str);
};

var u = navigator.userAgent;
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var isWeixin = u.indexOf('MicroMessenger') > -1; //微信

function isWeekdayTradingTime() {
  const now = new Date();

  // 转换为北京时间（UTC+8）
  const beijingOffset = 8 * 60; // 北京时区偏移（分钟）
  const localOffset = now.getTimezoneOffset(); // 本地时区偏移
  const beijingTime = new Date(now.getTime() + (beijingOffset + localOffset) * 60 * 1000);

  const day = beijingTime.getDay();
  return day >= 1 && day <= 5; // 周一至周五
}

queryStatus();
function queryStatus(){
  if (isWeekdayTradingTime()) {
    $('#openStatus').text('开盘');
  } else {
    $('#openStatus').text('停盘');
  }
  setTimeout(queryStatus, 60000);
}

function thousandsFormat(num) {
  if(!num){
    return 0;
  }
  var c = (num.toString().indexOf ('.') !== -1) ? Number(num).toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return c;
}

String.prototype.replaceAll = function(s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
}