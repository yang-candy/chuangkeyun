;
var vm = {
  data: {},

  //绑定事件
  bindEvent: function() {

    //点击关注 或者 跳转作者客页
    $('.js-follow-v-list').on('click', 'li', vm.author2);
    $('.js-follow-list').on('click', 'li', vm.author2);
    $('.c-tab-ul').on('click', '.c-att-t', vm.tagFollow);

    //标签列表评论跳转到评论页
    $('.c-tab-ul').on('click', '.c-common', vm.tagCommon);

    //点赞动作
    $('.c-tab-ul').on('click', '.c-zan', vm.likeZan);

    //点击Tag获得TagId对应的News列表
    $('.js-td').on('click', 'li', vm.getTagContent);

    //跳转关注更多
    $('.c-att-more').on('click', vm.followV);
  },
  upScroll:function (fn){
    //上拉加载
    window.addEventListener('scroll', function(){
      var preLoadDis = '0.01';
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
  likeZan: function(e){
    e.stopPropagation();
    $target = $($(e.currentTarget));  

    //to do

  },
  followV:function(e){
    e.stopPropagation();
    ApiBridge.callNative('ClientViewManager', 'pushViewController',{pagetype:7,animationtype:1,set:{modename:'follow-more-tab',navigationtype:1,title:''}});
  },
  tagCommon: function(e){
    e.stopPropagation();
    $target = $($(e.currentTarget));  
    ApiBridge.callNative('ClientViewManager', 'pushViewController', {pagetype:2,animationtype:2,set:{navigationtype:2},param:{newsid:$target.attr('newsid')}});
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
  tagFollow: function(e){
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
        title:      $($followTarget).attr('usertitle'),
        description:$($followTarget).attr('userdesc') || '',
        username:   $($followTarget).attr('username')
      }
      ApiBridge.log($target.attr('userid'))
      vm.followToggle($($followTarget).attr('userid'), $type, $info, $($followTarget));
    }
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
                ApiBridge.callNative('ClientViewManager', 'showToastView', {type:1, msg:'关注成功!'})
              }else{
                target.removeClass('on'); 
                target.html('+  关注')
                ApiBridge.callNative('ClientViewManager', 'showToastView', {type:1, msg:'取消关注成功!'})
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
                ApiBridge.callNative('ClientViewManager', 'showToastView', {type:1, msg:'关注成功!'})
              }else{
                target.removeClass('on'); 
                target.html('+  关注')
                ApiBridge.callNative('ClientViewManager', 'showToastView', {type:1, msg:'取消关注成功!'})
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

  //下拉刷新
  reFresh: {
      init: function(opt){

        var dragThreshold = opt.dragThreshold || 0.3; // 临界值

        var moveCount = opt.moveCount || 200; // 位移系数

        var dragStart = null;// 开始抓取标志位

        var percentage = 0;// 拖动量的百分比

        var changeOneTimeFlag = 0;// 修改dom只执行1次标志位

        var joinRefreshFlag = null;// 进入下拉刷新状态标志位

        var refreshFlag = 0;// 下拉刷新执行是控制页面假死标志位

        var pullIcon = $('#pullIcon');// 下拉loading

        var pullText = $('#pullText');// 下拉文字dom

        var pullArrow = $('#arrowIcon');// 下拉箭头dom

        var dom = $(opt.container);

        dom.on('touchstart', function(event){


          if (refreshFlag) {
            event.preventDefault();
            return;
          }


          event = event.touches[0];
          dragStart = event.clientY;

          dom.css('-webkit-transition', 'none');
          pullIcon.hide();
          pullArrow.removeClass('down');
          pullArrow.removeClass('up');
        });

        dom.on('touchmove', function(event){

          if (dragStart === null) {
            return;
          }

          if (refreshFlag) {
            event.preventDefault();
            return;
          }


          var target = event.touches[0];

          percentage = (dragStart - target.clientY) / window.screen.height;

          // 当且紧当scrolltop是0且往下滚动时才触发
          if (document.body.scrollTop == 0) {
            if (percentage < 0) {
              event.preventDefault();
              if (!changeOneTimeFlag) {
                pullArrow.show();
                opt.beforePull && opt.beforePull();
                changeOneTimeFlag = 1;

              }

              var translateX = -percentage*moveCount;

              joinRefreshFlag = true;

              if (Math.abs(percentage) > dragThreshold) {
                pullText.text('释放刷新');
                pullArrow.removeClass('down');
                pullArrow.addClass('up');
              } else {
                pullText.text('下拉刷新');
                pullArrow.removeClass('up');
                pullArrow.addClass('down');
              }


              if (percentage > 0) {

                dom.css('-webkit-transform', 'translate3d(0,' + translateX + 'px,0)');
              } else {
                dom.css('-webkit-transform', 'translate3d(0,' + translateX + 'px,0)');
              }
            } else {

              if (joinRefreshFlag == null) {
                joinRefreshFlag = false;
              }
            }
          } else {

            if (joinRefreshFlag == null) {
              joinRefreshFlag = false;
            }
          }


        });
        dom.on('touchend', function(event){

          if (percentage === 0) {
            return;
          }


          if (refreshFlag) {
            event.preventDefault();
            return;
          }


          if (Math.abs(percentage) > dragThreshold && joinRefreshFlag) {


            opt.onRefresh && opt.onRefresh();


            dom.css('-webkit-transition', '330ms');
            pullText.text('正在刷新..');
            pullIcon.show();
            pullArrow.hide();

            dom.css('-webkit-transform', 'translate3d(0,' + 43 + 'px,0)');

            // 进入下拉刷新状态
            refreshFlag = 1;

            setTimeout(function(){
              pullText.text('刷新成功');
              pullIcon.hide();

              dom.css('-webkit-transform', 'translate3d(0,0,0)');

              setTimeout(function(){

                opt.afterPull && opt.afterPull();
                // 重置标志位
                refreshFlag = 0;
              },300);

            },700);
          } else {

            if (joinRefreshFlag) {
              refreshFlag = 1;
              dom.css('-webkit-transition', '330ms');
              dom.css('-webkit-transform', 'translate3d(0,0,0)');
              setTimeout(function(){
                opt.afterPull && opt.afterPull();
                // 重置标志位
                refreshFlag = 0;
              },300);
            }

          }

          // 重置changeOneTimeFlag
          changeOneTimeFlag = 0;

          // 重置joinRefreshFlag
          joinRefreshFlag = null;

          // 重置percentage
          dragStart = null;

          // 重置percentage
          percentage = 0;
        });
      }
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
        
      if(!vm.data.isLoad){
        $('.js-follow-list').append(html);
      }else{
        $('.js-follow-list').html(html);

        //超过20不展示
        $('.js-follow-list li').map(function(i,v){
          if(i > 19){
            $(v).hide();
          } 
        })
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
    vm.data.isLoad = true;
  },

  //获取我的关注ajax
  followAjax: function(url,opt){
    opt = opt || {};
    if(opt.au){
      var postData  ={
        pm: vm.mobileType() == 'iOS' ? 1 : 2,
        dt: opt.dt,
        pid: vm.data.lastpageid || '',
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
        if(!!res.result.vuserlist.length){
          $('.js-follow-more').show();
          $('.js-follow-v').hide();
          vm.followList(res.result.vuserlist, 1, 'net', vm.data);
        }else{
          //没有关注大 v
          if(vm.data.isloadmore){
            //vm.getV(url);          
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

  //本地上拉翻页
  localNextPage: function(){
    vm.data.localNextIndex++; 
    ApiBridge.log(vm.data.localNextIndex)
    $('.js-follow-list li').map(function(i,v){
      if(i < ((vm.data.localNextIndex+1) * 19) && (i >= vm.data.localNextIndex * 19)){
        $(v).show();     
      }    
    })
    vm.data.isLoad = true;
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
      }else{
        ApiBridge.callNative("ClientDataManager", "getLocalDataForFollow", {}, function(follow) {
          //本地数据有
          if (!!follow.result.length) {
            //to do
            var ids = [];
            follow.result.map(function(v){
              ids.push(v.userId);
            })
            vm.data.localDataLength = ids.length;
            ApiBridge.log(vm.data.localDataLength)
            if(vm.data.localDataLength < 20){
              return; 
            }
            vm.localNextPage();
          }
        }) 
      }
    }) 
  },

  getTagContent: function(e){
    e.stopPropagation();
    $target = $(e.target);
    if($('.c-tab-bd ul').eq($target.index()).html() == ''){
      vm.tagList($target.index());
    }
  },

  //标签列表
  tagList: function(index){
    ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
      //已登录
      if (Number(user.userId)) {
        vm.ajax({
          url: 'http://news.app.autohome.com.cn/chejiahao_v1.0.0/newspf/npnewlistfortagid.ashx',
          type: "GET",
          data: {
            pm: vm.mobileType() == 'iOS' ? 1 : 2,
            tagid: vm.getParam('tagid'),
            pid: vm.data.lastpageid || '',
            pagesize: 20,
            otype: 0,
            itype: type || 1,
            au: user.userAuth
          },
          dataType: "json",
          success: function(res, xml) {
            res = JSON.parse(res);
            if(!!res.result.vuserlist.length){
              vm.renderNews(res.result.vuserlist,index);
            }else{
              console.log('暂无数据')
            }
          },
          fail: function(status){
            ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
              ApiBridge.callNative('ClientViewManager', 'showLoadingView')
              vm.init();
            })
          }
        });

      }else{

      }
    }) 
  },

  //渲染new列表
  renderNews: function(data, index) {
    index = index || 0;
    if(!!data.length){
      var html = '';
      data.map(function(v){
        html += 
          '<li mediatype='+v['mediatype']+'>'
          +'<a class="c-att-t" userid='+v['userid']+ ' username='+ v['username'] + ' userpic=' +v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle='+v['title']+' userdesc='+v['description']+' href="javascript:;">'+(v['isattention'] ? '已关注' : '+ 关注')+'</a>'
          + '<img class="c-auth-img" src=' + v['userpic']+ ' alt="">'
          + '<p class="c-auth-title">'+ v['title']+'</p>'
          + '<p class="c-tab-jj">' + v['praisenum']+ '</p>'
          + '<img class="c-auth-info-img" src=' + v['indexdetail']+ ' alt="">'
          + '<p class="span c-tab-ue">'
          + '<span class="c-zan"><span class="c-num">'+v['praisenum']+'</span></span>' 
          + '<span class="c-common" newsid='+v['newsid']+' type='+v['mediatype']+'><span class="c-num">'+v['replycount']+'</span></span>' 
          + '</p>'
          + '<span class="c-looked">500 浏览</span>'
          + '</li>' 
      })
      $('.c-tab-bd ul').eq(index).html(html);
    }
  }
};
vm.bindEvent();


//本地数据页码
vm.data.localNextIndex = 0;

vm.data.isLoad = true;
if(/my-follow/.test(window.location.href)){
  ApiBridge.log(window.location.href)
  vm.init();
  vm.upScroll(function(){
    if(!!vm.data.isLoad){
      vm.data.isLoad = false;
      vm.followMore();
    }
  });
}

//加载更多
if(/follow-more-tab/.test(window.location.href)){
}

//标签列表
if(/tag-name/.test(window.location.href)){
  //下拉刷新
  vm.reFresh.init({
    container: '.container',
    beforePull: function(){
      console.log('beforePull')
    },
    onRefresh: function(){
      console.log('onRefresh')
    },
    afterPull: function(){
      console.log('afterPulll')
    },
  })

  //上拉加载
  vm.upScroll(function(){
    if(!!vm.data.isLoad){
      vm.data.isLoad = false;
      vm.followMore();
    }
  });

  //默认请求数据
  vm.tagList(); 
}

//tab切换
vm.tab('.js-td', '.js-tb')
ApiBridge.callNative('ClientViewManager', 'hideLoadingView')
