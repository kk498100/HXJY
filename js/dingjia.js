queryPrice();
function queryPrice(){
  var merchant = $('#merchant').val();
  var url = 'https://www.yunjintong.cn/price/data2?time=' + new Date().getTime();
  if(merchant){
    url = url + '&merchant=' + merchant;
  }

  $.get(url,function(res){
    if(res.code == 1 && res.data.length > 0){
      res.data.forEach(function(item) {
        if(!item){
          return;
        }
        var trNode = $('.jinjia_tab').find('tr[data-type=' + item.y + ']');
        var buyprice = $(trNode).find('.huishou').text();
        var salePrice = $(trNode).find('.xiaoshou').text();
        if (['242_au_1604', '242_au_1605', '242_au_1606'].includes(item.y)) {
          if(Number(buyprice) > Number(item.b)){
            $(trNode).find('.huishou').removeClass('f_hongse').addClass('f_lvse').text(item.b - 10);
          }else if(Number(buyprice) < Number(item.b)){
            $(trNode).find('.huishou').removeClass('f_lvse').addClass('f_hongse').text(item.b - 10);
          }else if(Number(item.b) > 0){
            $(trNode).find('.huishou').text(item.b - 10);
          }else{
            $(trNode).find('.huishou').text('--');
          }
        } else {
          if(Number(buyprice) > Number(item.b)){
            $(trNode).find('.huishou').removeClass('f_hongse').addClass('f_lvse').text(item.b);
          }else if(Number(buyprice) < Number(item.b)){
            $(trNode).find('.huishou').removeClass('f_lvse').addClass('f_hongse').text(item.b);
          }else if(Number(item.b) > 0){
            $(trNode).find('.huishou').text(item.b);
          }else{
            $(trNode).find('.huishou').text('--');
          }
        }

        if (['242_au_1604', '242_au_1605', '242_au_1606'].includes(item.y)) {

          if(!item.l || Number(item.s) <= 0){
            $(trNode).find('.xiaoshou').text('--');
          }else if(Number(salePrice) > Number(item.s)){
            $(trNode).find('.xiaoshou').removeClass('f_hongse').addClass('f_lvse').text(item.s - 10);
          }else if(Number(salePrice) < Number(item.s)){
            $(trNode).find('.xiaoshou').removeClass('f_lvse').addClass('f_hongse').text(item.s - 10);
          }else{
            $(trNode).find('.xiaoshou').text(item.s - 10);
          }
          if(item.a){
            $(trNode).find('.caozuo').html('<span class="btn">瀹氫环</span>');
          }else{
            var maxPrice = item.p && item.p > 0 ? item.p : '--';
            var minPrice = item.m && item.m > 0 ? item.m : '--';
            $(trNode).find('.caozuo').html('<span class="f_hongse jinjia_tab_span1">'+maxPrice+'</span>'+'<span class="f_lvse jinjia_tab_span1 bor_no">'+minPrice+'</span>');
          }
        } else {
          if(!item.l || Number(item.s) <= 0){
            $(trNode).find('.xiaoshou').text('--');
          }else if(Number(salePrice) > Number(item.s)){
            $(trNode).find('.xiaoshou').removeClass('f_hongse').addClass('f_lvse').text(item.s);
          }else if(Number(salePrice) < Number(item.s)){
            $(trNode).find('.xiaoshou').removeClass('f_lvse').addClass('f_hongse').text(item.s);
          }else{
            $(trNode).find('.xiaoshou').text(item.s);
          }
          if(item.a){
            $(trNode).find('.caozuo').html('<span class="btn">瀹氫环</span>');
          }else{
            var maxPrice = item.p && item.p > 0 ? item.p : '--';
            var minPrice = item.m && item.m > 0 ? item.m : '--';
            $(trNode).find('.caozuo').html('<span class="f_hongse jinjia_tab_span1">'+maxPrice+'</span>'+'<span class="f_lvse jinjia_tab_span1 bor_no">'+minPrice+'</span>');
          }

        }
        var buyProductType = $('.dingjiaDialog .product_type').val();
        if(buyProductType && buyProductType == item.y){
          $('.dingjiaDialog .price').val('¥ '+item.b);
          $('.dingjiaDialog .time').val(item.t);
          jisuan();
        }
      });
    }
  });
  // setTimeout(queryPrice, 1000);
}

setInterval(queryPrice, 1000);

$('.dingjiaDialog .bg_cancel,.dingjiaDialog .close').click(function(){
  $(this).parents('.dingjiaDialog').hide();
  $('.bm_dialogBg').hide();
  if(isIOS){
    $('body').removeClass('fixed')
  }
});
$(document).on('click','.jinjia_tab .btn',function () {
  var _this = $(this);
  $.get('/member/login/check',function(res){
    if(res != null && res.code == 1){
      var member = res.data;
      var productName = _this.parents('tr').find('.product_name').text();
      var price = _this.parents('tr').find('.huishou').text();
      var productType = _this.parents('tr').data('type');
      $('.dingjiaDialog .product_type').val(productType);
      $('.dingjiaDialog .price').val('¥ '+price);
      $('.dingjiaDialog .product_name').text(productName);
      $('.dingjiaDialog').show();
      $('.bm_dialogBg').show();
      $('.bookWeight').focus();
      $('#telephone').val(member.telephone);
      $('#customerName').val(member.name);
      $('#saler').text(member.name);
      if(member.credit && member.credit > 0){
        $('.dingjiaDialog .creditP').show();
        $('.dingjiaDialog .credit').val('¥ '+member.credit);
      }else{
        $('.dingjiaDialog .creditP').hide();
        $('.dingjiaDialog .credit').val('0');
      }
      if(member.balance && member.balance > 0){
        $('.dingjiaDialog .balanceP').show();
        $('.dingjiaDialog .balance').val('¥ '+member.balance);
      }else{
        $('.dingjiaDialog .balanceP').hide();
        $('.dingjiaDialog .balance').val('0');
      }
      if(isIOS){
        $('body').addClass('fixed')
      }else{
        $('.dingjiaDialog').css('fixed');
      }
    }else{
      location.href="/member/login/view?merchant="+$('#merchant').val();
    }
  });
});
$(document).on('keyup','.dingjiaDialog .bookWeight',function () {
  var value = $(this).val().replaceAll(',','').replace(/^0*(\d+(?:\.\d{0,2})?).*$/,"$1");
  $(this).val(value);
  jisuan();
});

//定价
function place(){
  var flag = true;
  $('#dingjiaForm .bg_save').attr('disabled','disabled').text('提交中...');
  $('#dingjiaForm .required').each(function(){
    var value = $.trim($(this).val());
    if(!value){
      $(this).focus();
      webToast($(this).data('msg'));
      return flag = false;
    }
    if($(this).hasClass('telephone') && !isPhone(value)){
      $(this).focus();
      webToast($(this).data('msg'));
      return flag = false;
    }
  });
  if(!flag){
    $('#dingjiaForm .bg_save').removeAttr('disabled').text('确定');
    return;
  }
  if(Number($('#buyMin').val()) > Number($('#dingjiaForm .bookWeight').val().replaceAll(',',''))){
    webToast('回购克重不能少于'+$('#buyMin').val()+'克');
    $('#dingjiaForm .bg_save').removeAttr('disabled').text('确定');
    return;
  }
  if(Number($('#buyMax').val()) < Number($('#dingjiaForm .bookWeight').val().replaceAll(',',''))){
    webToast('回购克重不能多于'+$('#buyMax').val()+'克');
    $('#dingjiaForm .bg_save').removeAttr('disabled').text('确定');
    return;
  }
  var checked=$('#agreeCheckbox').is(':checked');
  if(!checked){
    $('#dingjiaForm .bg_save').removeAttr('disabled').text('确定');
    webToast('请阅读并同意在线定价服务协议');
    return false;
  }
  $.post('/order/place',$('#dingjiaForm').serialize(),function(res){
    if(res != null && res.code == 1){
      webToast('定价成功');
      location.href='/payment/pay/'+res.data+'?merchant='+$('#merchant').val();
    }else{
      $('#dingjiaForm .bg_save').removeAttr('disabled').text('确定');
      webToast(res.msg);
    }
  }).fail(function() {
    $('#dingjiaForm .bg_save').removeAttr('disabled').text('确定');
    webToast('系统异常，请稍后再试');
  });
}
//计算价格
function jisuan(){
  var rate = $('#depositRate').val();
  var bookWeight = $.trim($('.dingjiaDialog .bookWeight').val().replaceAll(',',''));
  var price = $.trim($('.dingjiaDialog .price').val().replaceAll('¥',''));
  var credit = $.trim($('.dingjiaDialog .credit').val().replaceAll('¥',''));
  var balance = $.trim($('.dingjiaDialog .balance').val().replaceAll('¥',''));
  var deposit = (bookWeight*rate - Number(credit)).toFixed(2);
  if(deposit <=0){
    $('.dingjiaDialog .deposit').val('¥ 0.00');
    return;
  }
  deposit = (Number(deposit) - Number(balance)).toFixed(2);
  if(deposit <=0){
    $('.dingjiaDialog .deposit').val('¥ 0.00');
  }else{
    $('.dingjiaDialog .deposit').val('¥ ' + deposit);
  }
}

function loginCallback(){
  webToast('登录成功');
  location.reload();
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
