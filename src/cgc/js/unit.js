;
var vm = {
  data: {},

  //绑定事件
  bindEvent: function() {
    //点击关注 或者 跳转作者客页
    $('.js-follow-v-list').on('click', 'li', vm.author2);
    $('.js-follow-list').on('click', 'li', vm.author2);

    //跳转大V
    $('.c-att-more').on('click', vm.followV);
  },
  upScroll:function (fn){
    //上拉加载
    window.addEventListener('scroll', function(){
      var preLoadDis = '0.2';
      var offsetHeight = window.innerHeight,
        scrollHeight = document.body.scrollHeight,
          scrollTop = document.body.scrollTop;

          if (parseInt(preLoadDis) != preLoadDis) { // 如果是小数 则为百分比距离
            preLoadDis = scrollHeight * preLoadDis;
          }
          if ((scrollTop + offsetHeight) >= scrollHeight - preLoadDis) {
            fn();
          }
    });
  },
  followV:function(e){
    e.stopPropagation();
    ApiBridge.callNative('ClientViewManager', 'pushViewController',{pagetype:7,animationtype:1,set:{modename:'follow-more-tab',navigationtype:1,title:'关注更多'}});
  },
  author2: function(e){
    e.stopPropagation();
    $target = $($(e.currentTarget));  

    $followTarget = e.target;

    //点了关注
    if($followTarget.tagName == 'A'){
      var $type = $(e.target).hasClass('on') ? 1 : 0;
      var $info = {
        imgurl:     $($followTarget).attr('userpic'),
        time:       $($followTarget).attr('usertime') || '',
        userid:     $($followTarget).attr('userid'),
        title:      $($followTarget).attr('title'),
        description:$($followTarget).attr('userdesc') || '',
        username:   $($followTarget).attr('username')
      }
      ApiBridge.log($target.attr('userid'))
      vm.followToggle($($followTarget).attr('userid'), $type, $info, $($followTarget));
      return;
    }
    ApiBridge.callNative('ClientViewManager', 'pushViewController', {pagetype:7,animationtype:1,set:{modename:'author',navigationtype:2},param:{userId:$target.attr('userId')}});
  },
  //关注未关注
  followToggle: function(userid, type, info, target){
    ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
      //已登录
      if (Number(user.userId)) {
        if(!type){
          var $url = 'https://youchuangopen.api.autohome.com.cn/OpenUserService.svc/Follow';
        }else{
          var $url = 'https://youchuangopen.api.autohome.com.cn/OpenUserService.svc/UnFollow';
        }
        vm.ajax({
          url: $url ,
          type: "POST",
          data: {
            userid: userid,
          },
          dataType: "json",
          success: function(res, xml) {
            res = JSON.parse(res);
            ApiBridge.log(res)
            if(!!res.result){
              if(!type){
                target.addClass('on'); 
                target.html('已关注')
              }else{
                target.removeClass('on'); 
                target.html('+  关注')
              }
            }
          },
          fail: function(status){
          }
        });
      }else{
        if(!type){
          var $url = 'addLocalDataForFollow';
        }else{
          var $url = 'deletLocalDataForFollow';
        }
        var post = !type ? info : {userid:info.userid};
        ApiBridge.log(JSON.stringify(info))
        ApiBridge.callNative('ClientDataManager', $url, post, function(result) {
          if(!!result.result){
              if(!type){
                target.addClass('on'); 
                target.html('已关注')
              }else{
                target.removeClass('on'); 
                target.html('+  关注')
              }
          }
        })
      }
    })
  },
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
  },

  //展示关注信息
  followList: function(data,isType, net, pageinfo) {
    //isType 1,本地或网络有已关注
    if(!!isType && !!data.length){
      var html = '';
      data.map(function(v){
        if(!!net){
          html += '<li userid='+v['userid']+'> <img src='+v['userpic']+' alt=""> <span class="c-att-time">'+v['time']+'</span> <h3 class="c-att-title">'+v['username']+'</h3> <p class="c-att-info">'+v['title']+'</p> </li>';
        }else{
          html += '<li userId='+v['userId']+'> <img src='+v['imgurl']+' alt=""> <span class="c-att-time">'+v['time']+'</span> <h3 class="c-att-title">'+v['userName']+'</h3> <p class="c-att-info">'+v['title']+'</p> </li>';
        }
      })
        
      if(!!vm.data.isloadmore){
        $('.js-follow-list').append(html);
      }else{
        $('.js-follow-list').html(html);
      }
    }

    //大 v推荐
    if(!isType && !!data.length){
      var html = '';
      data.map(function(v){
        html += '<li > <a class="c-att-href" userid='+v['userid']+ ' username='+ v['username'] + ' userpic=' +v['userpic'] + ' usertime=' + (v['createtime'] || '') + ' usertitle='+v['title']+' userdesc='+v['userdesc']+' href="javascript:;">＋关注</a> <img src="'+v['userpic']+'" alt=""> <h3 class="c-att-title">'+v['username']+'</h3> <p class="c-att-fans">'+v['fansnum']+'粉丝</p> <p class="c-att-info">'+v['userdesc']+'</p> </li>';
      })
        
      $('.js-follow-v-list').html(html);
    }
  },

  //获取我的关注ajax
  followAjax: function(url,opt){
    opt = opt || {};
    if(opt.au){
      var postData  ={
        pm: vm.mobileType() == 'iOS' ? 1 : 2,
        dt: opt.dt,
        lastpageid: vm.data.lastpageid || '',
        pagesize:10,
        au: opt.au
      } 
    }else{
      var postData  ={
        pm: vm.mobileType() == 'iOS' ? 1 : 2,
        dt: opt.dt,
        vids: opt.vids
      }
    }
    vm.ajax({
      url: url,
      type: "GET",
      data: postData,
      dataType: "json",
      success: function(res, xml) {
        res = JSON.parse(res);
        vm.data.isloadmore = res.result.isloadmore || '';
        vm.data.lastpageid = res.result.lastpageid || '';
        vm.data.isLoad = true;
        if(!!res.result.vuserlist.length){
          $('.js-follow-more').show();
          $('.js-follow-v').hide();
          vm.followList(res.result.vuserlist, 1, 'net', vm.data);
        }else{
          //没有关注大 v
          if(vm.data.isloadmore){
            vm.getV(url);          
          }
        }
      },
      fail: function(status){
        $('.js-follow-more').hide();
        $('.js-follow-v').hide();
        ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
          ApiBridge.callNative('ClientViewManager', 'showLoadingView')
          vm.init();
        })
      }
    });
  },

  //取大v
  getV: function(url){
    vm.ajax({
      url: url,
      type: "GET",
      data: {
        pm: vm.mobileType() == 'iOS' ? 1 : 2,
        dt: 0,
        au: ''
      },
      dataType: "json",
      success: function(res, xml) {
        res = JSON.parse(res);
        if(!!res.result.vuserlist.length){
          $('.js-follow-more').hide();
          $('.js-follow-v').show();
          vm.followList(res.result.vuserlist, 0);
        }
      },
      fail: function(status){
        $('.js-follow-more').hide();
        $('.js-follow-v').hide();
        ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
          ApiBridge.callNative('ClientViewManager', 'showLoadingView')
          vm.init();
        })
      }
    });
  },

  //关注初始化
  init: function() {
    ApiBridge.callNative('ClientViewManager', 'hideLoadingView')
    ApiBridge.callNative('ClientViewManager', 'setNavigationTabBarTitle', {
      title: '我的关注'
    });

    //判断是否联网
    ApiBridge.callNative("ClientDataManager", "getNetworkState", {}, function(state) {
      vm.data.isNet = state.result;

      //未联网
      if (!Number(vm.data.isNet)) {
        //判断是否有数据
        ApiBridge.callNative("ClientDataManager", "getLocalDataForFollow", {}, function(follow) {
          //本地数据有
          if (follow.result.length) {
            vm.followList(follow.result, 1);
            $('.js-follow-more').show();
            $('.js-follow-v').hide();
          } else {
            $('.js-follow-more').hide();
            $('.js-follow-v').hide();
            ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
              ApiBridge.callNative('ClientViewManager', 'showLoadingView')
              vm.init();
            })
          }
        })
      }

      //联网
      if (Number(vm.data.isNet)) {
        ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {

          if (Number(user.userId)) {
            //已登录
            vm.followAjax("http://news.app.autohome.com.cn/chejiahao_v1.0.0/newspf/npgetvuserlist.json",{dt:1, au: user.userAuth}) 
          }else{
            //未登录
            ApiBridge.callNative("ClientDataManager", "getLocalDataForFollow", {}, function(follow) {
              //本地数据有
              if (!!follow.result.length) {
                //to do
                var ids = [];
                follow.result.map(function(v){
                  ids.push(v.userId);
                })
                vm.followAjax("http://news.app.autohome.com.cn/chejiahao_v1.0.0/newspf/npgetvuserlist.json",{dt:1, vids: ids.toString()}) 
                //vm.followList(follow.result, 1);
                $('.js-follow-more').show();
                $('.js-follow-v').hide();
              } else {
                vm.getV("http://news.app.autohome.com.cn/chejiahao_v1.0.0/newspf/npgetvuserlist.json");
              }
            })
          }
        })
      }
    })
  },

  //关注上拉翻页
  followMore: function(){
    ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
      //已登录
      if (Number(user.userId)) {
        //取网络数据
        //传lastpageid分页
        if(!!vm.data.isloadmore){
          vm.followAjax("http://news.app.autohome.com.cn/chejiahao_v1.0.0/newspf/npgetvuserlist.json",{dt:1, au: user.userAuth}) 
        }
      }
    }) 
  }
};
vm.bindEvent();
vm.data.isLoad = true;
if(/my-follow/.test(window.location.href)){
  vm.init();
  vm.upScroll(function(){
    if(!!vm.data.isLoad){
      vm.followMore();
      vm.data.isLoad = false;
    }
  });
}

//tab切换
vm.tab('.js-td', '.js-tb')
