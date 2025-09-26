function isPhone(str) {
  var reg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/;
  return reg.test(str);
};

var u = navigator.userAgent;
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var isWeixin = u.indexOf('MicroMessenger') > -1; //微信

function isWeekdayTradingTime() {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // 周一 00:00 至 周五 23:59
  if (day === 1) { // 周一
    return totalMinutes >= 0; // 周一00:00开始
  } else if (day >= 2 && day <= 4) { // 周二至周四
    return true; // 全天都是
  } else if (day === 5) { // 周五
    return totalMinutes <= 23 * 60 + 59; // 周五23:59结束
  }

  return false; // 周六和周日
}

queryStatus();
function queryStatus(){
  if (isWeekdayTradingTime) {
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