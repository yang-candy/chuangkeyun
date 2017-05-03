;
var vm = {
  fastclick: (function() {
    if ('addEventListener' in document) {
      document.addEventListener('DOMContentLoaded', function() {
        window.FastClick.attach(document.body);
      }, false);
    }
  })(),
  //ajax
  ajax: function(options) {
    var _w = window;
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    var params = formatParams(options.data);
    //创建 - 非IE6 - 第一步
    if (_w.XMLHttpRequest) {
      var xhr = new XMLHttpRequest();
    } else {
      //IE6及其以下版本浏览器
      var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    //接收 - 第三步
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var status = xhr.status;
          if (status >= 200 && status < 300) {
            options.success && options.success(xhr.responseText, xhr.responseXML);
          } else {
            options.fail && options.fail(status);
          }
        }
      }
      //连接 和 发送 - 第二步
    if (options.type == "GET") {

      xhr.open("GET", options.url + "?" + params, true);
      xhr.send(null);
    } else if (options.type == "POST") {
      xhr.open("POST", options.url, true);
      //设置表单提交时的内容类型
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(params);
    }
    //格式化参数
    function formatParams(data) {
      var arr = [];
      for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
      }
      arr.push(("v=" + Math.random()).replace(".", ""));
      return arr.join("&");
    }
  },
  //判断机型
  mobileType: function() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }
    if (/android/i.test(userAgent)) {
      return "Android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
    }
    return "unknown";
  },

  //正则去除空格
  trim: function(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  },

  //获取url
  getParam: function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
  },

  //tab
  tab: function(td, tb) {
    var $td = $(td);
    var $tb = $(tb);
    var $index = 0;

    $tb.find('ul').hide();
    $tb.find('ul').eq(0).show();
    $td.on('click', 'li', function(e) {
      e.stopPropagation();
      $index = $(this).index();

      $(this).addClass('on').siblings().removeClass('on');
      $tb.find('ul').eq($index).show().siblings().hide();
    })
  }
};
vm.tab('.js-td', '.js-tb')
