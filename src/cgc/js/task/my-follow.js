// # 我的关注

//获取我的关注ajax
vm.followAjax = function(url, opt) {
  opt = opt || {};
  if (opt.au) {
    var postData = {
      pm: vm.mobileType() == 'iOS' ? 1 : 2,
      dt: opt.dt,
      pid: vm.data.lastpageid || '',
      pagesize: 10,
      au: opt.au
    }
  } else {
    var postData = {
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
      if (!!res.result.vuserlist.length) {
        $('.js-follow-more').show();
        $('.js-follow-v').hide();
        vm.followList(res.result.vuserlist, 1, 'net', vm.data);
      } else {
        //已登录本地数据没有
        if (opt.au) {
          vm.getV();
        } else {
          $('.c-tab-empty').show();
        }
      }
    },
    fail: function(status) {
      $('.js-follow-more').hide();
      $('.js-follow-v').hide();
      if (!!vm.data.localData.length) {
        $('.js-follow-more').show();
        //本地有数据，无网络
        vm.followList(vm.data.localData, 1, '', vm.data);
      } else {
        ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
          ApiBridge.callNative('ClientViewManager', 'showLoadingView')
          vm.init();
        })
      }
    }
  });
}

//取大v
vm.getV = function() {
  vm.ajax({
    url: vm.data.url + "/npgetvuserlist.json",
    type: "GET",
    data: {
      pm: vm.mobileType() == 'iOS' ? 1 : 2,
      dt: 0,
      au: ''
    },
    dataType: "json",
    success: function(res, xml) {
      res = JSON.parse(res);
      if (!!res.result.vuserlist.length) {
        $('.js-follow-more').hide();
        $('.js-follow-v').show();
        vm.followList(res.result.vuserlist, 0);
      } else {
        $('.js-follow-v').html('暂无数据');
      }
    },
    fail: function(status) {
      $('.js-follow-more').hide();
      $('.js-follow-v').hide();
      ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
        ApiBridge.callNative('ClientViewManager', 'showLoadingView')
        vm.init();
      })
    }
  });
}

//本地上拉翻页
vm.localNextPage = function() {
  vm.data.localNextIndex++;
  $('.js-follow-list li').map(function(i, v) {
    if (i < ((vm.data.localNextIndex + 1) * 19) && (i >= vm.data.localNextIndex * 19)) {
      $(v).show();
    }
  })
  vm.data.isLoad = true;
}

//展示关注信息
vm.followList = function(data, isType, net, pageinfo) {
  //isType 1,本地或网络有已关注
  if (!!isType && !!data.length) {
    var html = '';
    data.map(function(v) {
      if (!!net) {
        html += '<li userid=' + v['userid'] + '> <img src=' + v['userpic'] + ' alt=""> <span class="c-att-time">' + v['createtime'] + '</span> <h3 class="c-att-title">' + v['username'] + '</h3> <p class="c-att-info">' + v['title'] + '</p> </li>';
      } else {
        html += '<li userid=' + v['userId'] + '> <img src=' + v['imgurl'] + ' alt=""> <span class="c-att-time">' + v['time'] + '</span> <h3 class="c-att-title">' + v['userName'] + '</h3> <p class="c-att-info">' + v['title'] + '</p> </li>';
      }
    })

    if (!vm.data.isLoad) {
      $('.js-follow-list').append(html);
    } else {
      $('.js-follow-list').html(html);

      //超过20不展示
      $('.js-follow-list li').map(function(i, v) {
        if (i > 19) {
          $(v).hide();
        }
      })
    }
    //判断有无图片
    data.map(function(v,i){
      if(v['userpic'] || v['imgurl']){
        $('.js-follow-list li').eq(i).find('img').css('background', 'none');
      } 
    })
  }

  //大 v推荐
  if (!isType && !!data.length) {
    var html = '';
    data.map(function(v) {
      html += '<li userid=' + v['userid'] + '><a class="c-att-href" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertitle=' + v['title'] + ' userdesc=' + v['userdesc'] + ' href="javascript:;" usertime=' + v['createtime'] + '>＋关注</a> <img src="' + v['userpic'] + '" alt=""> <h3 class="c-att-title">' + v['username'] + '</h3> <p class="c-att-fans">' + (!!v['fansnum'] ? (v['fansnum'] + '粉丝') : '') + '</p> <p class="c-att-info">' + v['userdesc'] + '</p> </li>';
    })

    $('.js-follow-v-list').html(html);

    //判断有无图片
    data.map(function(v,i){
      if(v['userpic'] || v['imgurl']){
        $('.js-follow-v-list li').eq(i).find('img').css('background', 'none');
      } 
    })
  }
  vm.data.isLoad = true;
}

//关注初始化
vm.init = function() {
  ApiBridge.callNative('ClientNavigationManager', 'setNavTitle', {
    title: '我的关注'
  }, function() {});

  ApiBridge.callNative('ClientViewManager', 'hideLoadingView')

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
    if (!!Number(vm.data.isNet)) {
      ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {

        if (Number(user.userId)) {
          //已登录
          vm.followAjax(vm.data.url + "/npgetvuserlist.json", {
            dt: 1,
            au: user.userAuth
          })
        } else {
          //init 本地关注数据
          vm.data.localData = [];
          //未登录
          ApiBridge.callNative("ClientDataManager", "getLocalDataForFollow", {}, function(follow) {
            //本地数据有
            if (!!follow.result.length) {
              var ids = [];
              vm.data.localData = follow.result;
              follow.result.map(function(v) {
                ids.push(v.userId);
              })
              vm.followAjax(vm.data.url + "/npgetvuserlist.json", {
                dt: 1,
                vids: ids.toString()
              })
              $('.js-follow-more').show();
              $('.js-follow-v').hide();
            } else {
              vm.getV();
            }
          })
        }
      })
    }
  })
}

//关注上拉翻页
vm.followMore = function() {
  $('.c-loading').hide();
  //判断是否联网
  ApiBridge.callNative("ClientDataManager", "getNetworkState", {}, function(state) {
    vm.data.isNet = state.result;
    if (!Number(vm.data.isNet)) {
      ApiBridge.callNative("ClientViewManager", "showErrorTipsViewForNoNetWork", {
        top: 'topNavTop'
      })
      return;
    }

    ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
      //已登录
      if (Number(user.userId)) {
        //取网络数据
        //传lastpageid分页
        if (!!vm.data.isloadmore) {
          vm.followAjax(vm.data.url + "/npgetvuserlist.json", {
            dt: 1,
            au: user.userAuth
          })
        }
      } else {
        ApiBridge.callNative("ClientDataManager", "getLocalDataForFollow", {}, function(follow) {
          //本地数据有
          if (!!follow.result.length) {
            //to do
            var ids = [];
            follow.result.map(function(v) {
              ids.push(v.userId);
            })
            vm.data.localDataLength = ids.length;
            if (vm.data.localDataLength < 20) {
              return;
            }
            vm.localNextPage();
          }
        })
      }
    })
  })
}

if (/my-follow/.test(window.location.href)) {
  vm.init();
  vm.upScroll(function() {
    if (!!vm.data.isLoad) {
      vm.data.isLoad = false;
      $('.c-loading').show();
      vm.followMore();
    }
  });
}
