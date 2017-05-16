;
var vm = {
  data: {
    url: 'http://news.app.autohome.com.cn/chejiahao_v1.0.0/newspf'
  },

  //绑定事件
  bindEvent: function() {

    //点击关注 或者 跳转作者客页
    $('.js-follow-v-list').on('click', 'li', vm.author2);
    $('.js-follow-list').on('click', 'li', vm.author2);

    //标签部分视频点击创建
    $('.js-tag-list').on('click', '.c-tag-media', vm.createVideo);

    //关注更多 -->跳转作者客页
    $('.js-follow-more-list').on('click', 'li', vm.author2);

    //标签列表 -->评论跳转到评论页
    $('.js-tag-list').on('click', '.c-common', vm.tagCommon);

    //标签列表 -->跳转文章最终页
    $('.js-tag-list').on('click', 'li', vm.artical);

    //标签列表 -->点击头像或名字跳转个人主页
    $('.js-tag-list').on('click', '.c-media-info', vm.author2);

    //标签列表 -->点赞动作
    $('.js-tag-list').on('click', '.c-zan', vm.likeZan);

    //点击Tag获得TagId对应的News列表
    $('.js-tag-title').on('click', 'li', vm.getTagContent);

    //跳转关注更多
    $('.c-att-more').on('click', vm.followV);

    //点击关注更多左侧bar 获取右侧list
    $('.js-follow-more-bar').on('click', 'li', vm.getFollowMore);

  },
  getFollowMore: function(e) {
    e.stopPropagation();
    var $target = $(e.target);

    //vm.data.lastId = '';

    ApiBridge.callNative("ClientDataManager", "getNetworkState", {}, function(state) {
      vm.data.isNet = state.result;

      //未联网
      if (!Number(vm.data.isNet)) {
        ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
          ApiBridge.callNative('ClientViewManager', 'showLoadingView')
          vm.data.isLoad = true;
          vm.getFollowMoreBar();
        })
      } else {
        if (vm.data.isFollowMore) {
          return;
        }
        if ($('.js-follow-more-list ul').eq($target.index()).html() == '') {
          vm.getFollowMoreList($target.attr('ids'), $target.index());
        }
      }
    })
  },

  deleteVideo: function(e) {
    window.addEventListener('scroll', function() {
      var offsetHeight = window.innerHeight,
        scrollTop = document.body.scrollTop;
      var $titleHeight = $('.js-tag-title').height();

      if (!!vm.data.mediaStatus) {
        if ((vm.data.mediaHeight + vm.data.mediaY - $titleHeight) < scrollTop || (vm.data.mediaY - offsetHeight > scrollTop)) {
          vm.data.mediaStatus = false;
          console.log('delete')
          ApiBridge.callNative('ClientVideoManager', 'deleteById', {
            mediaid: vm.data.mediaid,
          });
        }
      }
    });
  },

  createVideo: function(e) {
    e.stopPropagation();

    var $target = $(e.currentTarget);
    vm.data.mediaStatus = true;
    vm.data.mediaid = $(e.currentTarget).attr('mediaid');
    vm.data.mediatype = $(e.currentTarget).attr('mediatype');
    vm.data.mediatitle = $(e.currentTarget).attr('mediatitle');
    //vm.data.mediaWidth = $(e.currentTarget).find('img').width();
    vm.data.mediaHeight = $(e.currentTarget).find('img').height();
    vm.data.mediaX = $(e.currentTarget).find('img')[0].x;
    vm.data.mediaY = $(e.currentTarget).find('img')[0].y;
    //- document.body.scrollTop;

    var postData = {
      mediaid: vm.data.mediaid,
      //width: vm.data.mediaWidth,
      //height: vm.data.mediaHeight,
      title: vm.data.mediatitle,
      x: vm.data.mediaX,
      y: vm.data.mediaY,
      status: $target.attr('status'),
      playtime: $target.attr('playtime'),
      thumbnailpics: $target.attr('thumbnailpics').split(',')
    }

    if (vm.data.mediatype == 3) {
      ApiBridge.callNative('ClientVideoManager', 'createById', postData);
    }
    if (vm.data.mediatype == 4) {
      ApiBridge.callNative('ClientAudioManager', 'createById', postData);
    }
  },

  //保存到localStorage
  //localStorage.clear();
  setLs: function(key, value) {
    if (!key) return;
    value = (typeof value == 'string') ? value : JSON.stringify(value);
    window.localStorage.setItem(key, value);
  },
  getLs: function(key) {
    if (!key) return;
    var value = window.localStorage.getItem(key);
    return JSON.parse(value);
  },
  upScroll: function(fn) {
    //上拉加载
    window.addEventListener('scroll', function() {
      //var preLoadDis = '0.0001';
      var offsetHeight = window.innerHeight,
        scrollHeight = document.body.scrollHeight,
        scrollTop = document.body.scrollTop;

      //if (parseInt(preLoadDis) != preLoadDis) { // 如果是小数 则为百分比距离
      //  preLoadDis = scrollHeight * preLoadDis;
      //}
      if ((scrollTop + offsetHeight) >= scrollHeight /* - preLoadDis */ ) {
        fn();
      }
    });
  },

  artical: function(e) {
    e.stopPropagation();

    var $followTarget = e.target;
    var $curTarget = e.currentTarget;

    if (e.target.tagName == 'A') {
      console.log('ddddd')
      var $type = $(e.target).hasClass('on') ? 1 : 0;
      var $info = {
        imgurl: $($followTarget).attr('userpic'),
        time: $($followTarget).attr('usertime') || '',
        userid: $($followTarget).attr('userid'),
        title: $($followTarget).attr('title'),
        description: $($followTarget).attr('userdesc') || '',
        username: $($followTarget).attr('username')
      }
      console.log($info)
      vm.followToggle($($followTarget).attr('userid'), $type, $info, $($followTarget));
      return;
    }
    if (e.target.className == 'c-auth-info-img' && ($($curTarget).attr('mediatype') == 3 || $($curTarget).attr('mediatype') == 4)) {
      return;
    }
    if (e.target.tagName != 'LI' && e.target.className != 'c-auth-info-img' && (e.target.className != 'c-tab-jj ' && e.target.className != 'c-tab-jj short' && e.target.className != 'c-tab-jj long')) {
      return;
    }
    $target = $(e.currentTarget);

    ApiBridge.callNative('ClientViewManager', 'pushViewController', {
      pagetype: 2,
      animationtype: 2,
      param: {
        newsid: $target.attr('newsid'),
        type: $target.attr('mediatype'),
        autoscrolltocomment: 0
      }
    });
  },
  likeZan: function(e) {
    e.stopPropagation();
    $target = $(e.currentTarget);

    if ($target.hasClass('on')) {
      return
    };
    var num = Number($target.find('.c-num').html());
    num++;
    $target.find('.c-num').html(num);
    var html = '<span class="c-add1">+1</span>'
    $target.append(html);

    setTimeout(function() {
      $('.c-add1').remove();
    }, 1000)
    $target.find('.zan-icon').addClass('on')

    vm.ajax({
      url: 'https://reply.autohome.com.cn/api/like/set.json',
      type: "POST",
      data: {
        pm: vm.mobileType() == 'iOS' ? 1 : 2,
        dt: 0,
        au: ''
      },
      dataType: "json",
      success: function(res, xml) {},
      fail: function(status) {}
    });
  },
  followV: function(e) {
    e.stopPropagation();
    ApiBridge.callNative('ClientViewManager', 'pushViewController', {
      pagetype: 7,
      animationtype: 1,
      set: {
        modename: 'follow-more-tab',
        navigationtype: 1,
        title: ''
      }
    });
  },
  tagCommon: function(e) {
    e.stopPropagation();
    $target = $(e.currentTarget);
    ApiBridge.callNative('ClientViewManager', 'pushViewController', {
      pagetype: 2,
      animationtype: 2,
      set: {
        navigationtype: 2
      },
      param: {
        newsid: $target.attr('newsid')
      }
    });
  },
  author2: function(e) {
    e.stopPropagation();
    $target = $(e.currentTarget);

    var $followTarget = e.target;

    //跳转到作者客页
    ApiBridge.callNative('ClientViewManager', 'pushViewController', {
      pagetype: 7,
      animationtype: 1,
      set: {
        modename: 'author',
        ispagefullscreen: 1,
        navigationalpha: 0,
        navigationbacktype: 5,
        navigationrighticon: {
          icon1: 'articleplatform_icon_share_p',
        },
        navigationtype: 2
      },
      param: {
        userId: $target.attr('userId')
      }
    });
  },

  //关注未关注
  followToggle: function(userid, type, info, target) {
    ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
      //已登录
      if (Number(user.userId)) {
        if (!type) {
          var $url = 'https://youchuangopen.api.autohome.com.cn/OpenUserService.svc/Follow';
        } else {
          var $url = 'https://youchuangopen.api.autohome.com.cn/OpenUserService.svc/UnFollow';
        }
        vm.ajax({
          url: $url,
          type: "POST",
          data: {
            userid: userid,
          },
          dataType: "json",
          success: function(res, xml) {
            res = JSON.parse(res);
            if (!!res.result) {
              if (!type) {
                target.addClass('on');
                target.html('已关注')
                ApiBridge.callNative('ClientViewManager', 'showToastView', {
                  type: 1,
                  msg: '关注成功!'
                })
              } else {
                target.removeClass('on');
                target.html('+  关注')
                ApiBridge.callNative('ClientViewManager', 'showToastView', {
                  type: 1,
                  msg: '取消关注成功!'
                })
              }
            }
          },
          fail: function(status) {}
        });
      } else {
        if (!type) {
          var $url = 'addLocalDataForFollow';
        } else {
          var $url = 'deletLocalDataForFollow';
        }
        var post = !type ? info : {
          userid: info.userid
        };
        ApiBridge.callNative('ClientDataManager', $url, post, function(result) {
          if (!!result.result) {
            if (!type) {
              target.addClass('on');
              target.html('已关注')
              ApiBridge.callNative('ClientViewManager', 'showToastView', {
                type: 1,
                msg: '关注成功!'
              })
            } else {
              target.removeClass('on');
              target.html('+  关注')
              ApiBridge.callNative('ClientViewManager', 'showToastView', {
                type: 1,
                msg: '取消关注成功!'
              })
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
    init: function(opt) {

      var dragThreshold = opt.dragThreshold || 0.1; // 临界值

      var moveCount = opt.moveCount || 600; // 位移系数

      var dragStart = null; // 开始抓取标志位

      var percentage = 0; // 拖动量的百分比

      var changeOneTimeFlag = 0; // 修改dom只执行1次标志位

      var joinRefreshFlag = null; // 进入下拉刷新状态标志位

      var refreshFlag = 0; // 下拉刷新执行是控制页面假死标志位

      var pullIcon = $('#pullIcon'); // 下拉loading

      var pullText = $('#pullText'); // 下拉文字dom

      var pullArrow = $('#arrowIcon'); // 下拉箭头dom

      var dom = $(opt.container);

      dom.on('touchstart', function(event) {

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

      dom.on('touchmove', function(event) {

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

            var translateX = -percentage * moveCount;
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
      dom.on('touchend', function(event) {
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
          dom.css('-webkit-transform', 'translate3d(0,' + 50 + 'px,0)');

          // 进入下拉刷新状态
          refreshFlag = 1;

          setTimeout(function() {
            pullText.text('刷新成功');
            pullIcon.hide();

            dom.css('-webkit-transform', 'translate3d(0,0,0)');

            setTimeout(function() {

              opt.afterPull && opt.afterPull();
              // 重置标志位
              refreshFlag = 0;
            }, 300);

          }, 700);
        } else {
          if (joinRefreshFlag) {
            refreshFlag = 1;
            dom.css('-webkit-transition', '330ms');
            dom.css('-webkit-transform', 'translate3d(0,0,0)');
            setTimeout(function() {
              opt.afterPull && opt.afterPull();
              // 重置标志位
              refreshFlag = 0;
            }, 300);
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
  followList: function(data, isType, net, pageinfo) {
    //isType 1,本地或网络有已关注
    if (!!isType && !!data.length) {
      var html = '';
      data.map(function(v) {
        if (!!net) {
          html += '<li userid=' + v['userid'] + '> <img src=' + v['userpic'] + ' alt=""> <span class="c-att-time">' + v['createtime'] + '</span> <h3 class="c-att-title">' + v['username'] + '</h3> <p class="c-att-info">' + v['title'] + '</p> </li>';
        } else {
          html += '<li userId=' + v['userId'] + '> <img src=' + v['imgurl'] + ' alt=""> <span class="c-att-time">' + v['time'] + '</span> <h3 class="c-att-title">' + v['userName'] + '</h3> <p class="c-att-info">' + v['title'] + '</p> </li>';
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
    }

    //大 v推荐
    if (!isType && !!data.length) {
      var html = '';
      data.map(function(v) {
        html += '<li > <a class="c-att-href" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertitle=' + v['title'] + ' userdesc=' + v['userdesc'] + ' href="javascript:;" usertime=' + v['createtime'] + '>＋关注</a> <img src="' + v['userpic'] + '" alt=""> <h3 class="c-att-title">' + v['username'] + '</h3> <p class="c-att-fans">' + (!!v['fansnum'] ? (v['fansnum'] + '粉丝') : '') + '</p> <p class="c-att-info">' + v['userdesc'] + '</p> </li>';
      })

      $('.js-follow-v-list').html(html);
    }
    vm.data.isLoad = true;
  },

  //获取我的关注ajax
  followAjax: function(url, opt) {
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
          //没有关注大 v
          if (vm.data.isloadmore) {
            //vm.getV(url);          
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
  },

  //取大v
  getV: function(url) {
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
        if (!!res.result.vuserlist.length) {
          $('.js-follow-more').hide();
          $('.js-follow-v').show();
          vm.followList(res.result.vuserlist, 0);
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
  },

  //关注初始化
  init: function() {
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
                vm.getV(vm.data.url + "/npgetvuserlist.json");
              }
            })
          }
        })
      }
    })
  },

  //本地上拉翻页
  localNextPage: function() {
    vm.data.localNextIndex++;
    $('.js-follow-list li').map(function(i, v) {
      if (i < ((vm.data.localNextIndex + 1) * 19) && (i >= vm.data.localNextIndex * 19)) {
        $(v).show();
      }
    })
    vm.data.isLoad = true;
  },

  //关注上拉翻页
  followMore: function() {
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
  },

  getTagContent: function(e) {
    e.stopPropagation();
    $target = $(e.target);
    vm.data.tagListIndex = $target.index();
    if ($('.c-tab-bd ul').eq($target.index()).html() == '') {
      vm.tagList($target.index());
    }
  },

  //标签列表
  tagList: function(index) {
    /*
    var res = {
      "message": "",
      "result": {
        "isloadmore": true,
        "lastid": "2017-05-15 15:34:18740|101018",
        "newslist": [{
          "content": "",
          "description": "",
          "identifiertype": "",
          "imageheight": 0,
          "imagewidth": 0,
          "indexdetail": ["https://qnwww2.autoimg.cn/youchuang/g14/M15/A2/5D/autohomecar__wKjByVkaav6AODgqAAJh9Is28Mg542.png?imageView2/2/w/640"],
          "isattention": 0,
          "iscandelete": 0,
          "mediaid": "333",
          "mediatype": 1,
          "newsid": 101175,
          "pics": [],
          "playtime": "",
          "praisenum": 0,
          "publishtime": "2017-05-16",
          "pv": 159,
          "replycount": "4",
          "seriesids": "",
          "session_id": "f86b69c046d34ebca5ccb9e19918b4ea",
          "status": 0,
          "statusNote": "",
          "statusStr": "",
          "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g14/M15/A2/5D/autohomecar__wKjByVkaav6AODgqAAJh9Is28Mg542.png?imageView2/1/w/400/h/225"],
          "title": "保时捷Macan漏油隐患波及奥迪，24万台Q5、Q7将被召回",
          "userid": 39356249,
          "username": "汽车评中评",
          "userpic": "https://qnwww2.autoimg.cn/youchuang/g9/M11/54/73/autohomecar__wKjBzljsQ52AWTKgAADEllW0O8w133.jpg?imageView2/1/w/120/h/120"

        }, {
          "content": "",
          "description": "",
          "identifiertype": "",
          "imageheight": 0,
          "imagewidth": 0,
          "indexdetail": ["https://qnwww2.autoimg.cn/youchuang/g15/M02/A2/CA/autohomecar__wKgH5VkZXliAPDKJAAhveSbp5ok870.jpg?imageView2/2/w/640"],
          "isattention": 0,
          "iscandelete": 0,
          "mediaid": "333333222",
          "mediatype": 2,
          "newsid": 101028,
          "pics": [],
          "playtime": "",
          "praisenum": 2,
          "publishtime": "2017-05-15",
          "pv": 307,
          "replycount": "1",
          "seriesids": "",
          "session_id": "f080eebbe59346058975b99e2616c2bd",
          "status": 0,
          "statusNote": "",
          "statusStr": "",
          "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g15/M02/A2/CA/autohomecar__wKgH5VkZXliAPDKJAAhveSbp5ok870.jpg?imageView2/1/w/400/h/225"],
          "title": "原来你是这样的汉子 体验长安CS95智趣格调",
          "userid": 38586638,
          "username": "跟我视驾",
          "userpic": "https://qnwww2.autoimg.cn/youchuang/g11/M13/2E/05/autohomecar__wKgH0ljHiTeAVBnvAAAwrCgJLxI146.jpg?imageView2/1/w/120/h/120"

        }, {
          "content": "",
          "description": "",
          "identifiertype": "",
          "imageheight": 0,
          "imagewidth": 0,
          "indexdetail": ["https://qnwww2.autoimg.cn/youchuang/g22/M04/C9/3B/autohomecar__wKjBwVkZWRCARNAVAAyajoqWYLY268.jpg?imageView2/2/w/640"],
          "isattention": 0,
          "iscandelete": 0,
          "mediaid": "83943242",
          "mediatype": 3,
          "newsid": 101018,
          "pics": [],
          "playtime": "",
          "praisenum": 0,
          "publishtime": "2017-05-15",
          "pv": 382,
          "replycount": "0",
          "seriesids": "",
          "session_id": "e935c82d33b54a4dbe6e8d0fba8ef70e",
          "status": 0,
          "statusNote": "",
          "statusStr": "",
          "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g22/M04/C9/3B/autohomecar__wKjBwVkZWRCARNAVAAyajoqWYLY268.jpg?imageView2/1/w/400/h/225"],
          "title": "融入智能科技的旗舰SUV 长安CS95推出高配专属车型",
          "userid": 25414521,
          "username": "车算子",
          "userpic": "https://qnwww2.autoimg.cn/youchuang/g18/M04/95/39/autohomecar__wKgH2VkScwKAM-DeAAQUdGTj1ss505.jpg?imageView2/1/w/120/h/120"

        }, {
          "content": "",
          "description": "",
          "identifiertype": "",
          "imageheight": 0,
          "imagewidth": 0,
          "indexdetail": ["https://qnwww2.autoimg.cn/youchuang/g22/M04/C9/3B/autohomecar__wKjBwVkZWRCARNAVAAyajoqWYLY268.jpg?imageView2/2/w/640"],
          "isattention": 0,
          "iscandelete": 0,
          "mediaid": "343243242",
          "mediatype": 4,
          "newsid": 101018,
          "pics": [],
          "playtime": "",
          "praisenum": 0,
          "publishtime": "2017-05-15",
          "pv": 382,
          "replycount": "0",
          "seriesids": "",
          "session_id": "e935c82d33b54a4dbe6e8d0fba8ef70e",
          "status": 0,
          "statusNote": "",
          "statusStr": "",
          "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g22/M04/C9/3B/autohomecar__wKjBwVkZWRCARNAVAAyajoqWYLY268.jpg?imageView2/1/w/400/h/225"],
          "title": "融入智能科技的旗舰SUV 长安CS95推出高配专属车型",
          "userid": 25414521,
          "username": "车算子",
          "userpic": "https://qnwww2.autoimg.cn/youchuang/g18/M04/95/39/autohomecar__wKgH2VkScwKAM-DeAAQUdGTj1ss505.jpg?imageView2/1/w/120/h/120"

        }]

      },
      "returncode": 0

    }
    vm.renderTagList(res.result.newslist, index);
    return;
    */
    vm.ajax({
      url: vm.data.url + '/npnewlistfortagid.json',
      type: "GET",
      data: {
        pm: vm.mobileType() == 'iOS' ? 1 : 2,
        tagid: vm.getParam('tagid'),
        pid: vm.data.lastpageid || '',
        pagesize: 20,
        otype: 0,
        itype: index + 1 || 1
      },
      dataType: "json",
      success: function(res, xml) {
        res = JSON.parse(res);
        vm.data.isloadmore = res.result.isloadmore || '';
        vm.data.lastpageid = res.result.lastid || '';

        if (!!res.result.newslist.length) {
          vm.renderTagList(res.result.newslist, index);
        } else {
          console.log('暂无数据')
        }
      },
      fail: function(status) {
        ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
          ApiBridge.callNative('ClientViewManager', 'showLoadingView')
          vm.init();
        })
      }
    });
  },

  //获取关注更多左侧bar
  getFollowMoreBar: function() {
    vm.data.lastId = [];
    //var res = {
    //    "message": "",
    //    "result": [{
    //          "id": 2,
    //              "name": "全部",
    //                  "sortnum": 1,
    //                      "usercount": 59
    //    },{                  
    //              "name": "自媒体",
    //                  "sortnum": 2,
    //                      "usercount": 16
    //                        
    //    }],
    //      "returncode": 0

    //}
    //      vm.renderFollowMoreBar(res.result);
    //return;
    vm.ajax({
      url: vm.data.url + '/getCategoryList.json',
      type: "GET",
      data: {},
      dataType: "json",
      success: function(res, xml) {
        res = JSON.parse(res);
        ApiBridge.callNative('ClientViewManager', 'hideLoadingView')
        if (!!res.result.length) {
          vm.renderFollowMoreBar(res.result);
        }
      },
      fail: function(status) {
        ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
          ApiBridge.callNative('ClientViewManager', 'showLoadingView')
          vm.getFollowMoreBar();
        })
      }
    });
  },

  //渲染关注更多左侧列表
  renderFollowMoreBar: function(data) {
    var html = '';
    var htmlUl = '';
    data.map(function(v) {
      html += '<li ids=' + v['id'] + '>' + v['name'] + '</li>';
      htmlUl += '<ul class="c-att-ul js-follow-v-list"></ul>'
    })
    htmlUl = htmlUl + '<div class="c-loading"><span class="loading-icon"></span><p>加载中...</p></div>'

    $('.js-follow-more-bar').html(html);
    $('.js-follow-more-bar li').eq(0).addClass('on');

    $('.js-follow-more-list').html(htmlUl);
    $('.js-follow-more-list ul').eq(0).show();

    //渲染右侧
    vm.getFollowMoreList($('.js-follow-more-bar li').eq(0).attr('ids'));
  },

  //获取关注更多第一个的关注列表
  getFollowMoreList: function(id, index) {
    vm.data.followMoreId = id;
    vm.data.followMoreIndex = index || 0;
    index = index || 0;
    //var res = {
    //  "message": "",
    //  "result": {
    //    "lastId": "100000000|2017/4/27 14:00:05|18759205",
    //    "loadMore": true,
    //    "users": [{
    //      "createtime": "2017-04-24 04:41:27",
    //      "fansnum": "",
    //      "isattention": 1,
    //      "title": "",
    //      "userdesc": "",
    //      "userid": 6098853,
    //      "username": "无限试驾",
    //      "userpic": "https://www2.autoimg.cn/youchuang/g8/M03/72/85/autohomecar__wKjBz1j-ueuAOxqEAALIEZP3Ens630.jpg"
    //    },{
    //      "createtime": "2017-04-24 04:41:27",
    //      "fansnum": "",
    //      "isattention": 1,
    //      "title": "",
    //      "userdesc": "",
    //      "userid": 6098853,
    //      "username": "无限试驾",
    //      "userpic": "https://www2.autoimg.cn/youchuang/g8/M03/72/85/autohomecar__wKjBz1j-ueuAOxqEAALIEZP3Ens630.jpg"
    //    },{
    //      "createtime": "2017-04-24 04:41:27",
    //      "fansnum": "",
    //      "isattention": 1,
    //      "title": "",
    //      "userdesc": "",
    //      "userid": 6098853,
    //      "username": "无限试驾",
    //      "userpic": "https://www2.autoimg.cn/youchuang/g8/M03/72/85/autohomecar__wKjBz1j-ueuAOxqEAALIEZP3Ens630.jpg"
    //    },{
    //      "createtime": "2017-04-24 04:41:27",
    //      "fansnum": "",
    //      "isattention": 1,
    //      "title": "",
    //      "userdesc": "",
    //      "userid": 6098853,
    //      "username": "无限试驾",
    //      "userpic": "https://www2.autoimg.cn/youchuang/g8/M03/72/85/autohomecar__wKjBz1j-ueuAOxqEAALIEZP3Ens630.jpg"
    //    },{
    //      "createtime": "2017-04-24 04:41:27",
    //      "fansnum": "",
    //      "isattention": 1,
    //      "title": "",
    //      "userdesc": "",
    //      "userid": 6098853,
    //      "username": "无限试驾",
    //      "userpic": "https://www2.autoimg.cn/youchuang/g8/M03/72/85/autohomecar__wKjBz1j-ueuAOxqEAALIEZP3Ens630.jpg"
    //    },{
    //      "createtime": "2017-04-24 04:41:27",
    //      "fansnum": "",
    //      "isattention": 1,
    //      "title": "",
    //      "userdesc": "",
    //      "userid": 6098853,
    //      "username": "无限试驾",
    //      "userpic": "https://www2.autoimg.cn/youchuang/g8/M03/72/85/autohomecar__wKjBz1j-ueuAOxqEAALIEZP3Ens630.jpg"
    //    },{
    //      "fansnum": "",
    //      "isattention": 1,
    //      "title": "",
    //      "userdesc": "",
    //      "userid": 6098853,
    //      "username": "无限试驾",
    //      "userpic": "https://www2.autoimg.cn/youchuang/g8/M03/72/85/autohomecar__wKjBz1j-ueuAOxqEAALIEZP3Ens630.jpg"
    //    },{
    //      "fansnum": "",
    //      "isattention": 1,
    //      "title": "",
    //      "userdesc": "",
    //      "userid": 6098853,
    //      "username": "无限试驾",
    //      "userpic": "https://www2.autoimg.cn/youchuang/g8/M03/72/85/autohomecar__wKjBz1j-ueuAOxqEAALIEZP3Ens630.jpg"
    //    },{
    //      "fansnum": "",
    //      "isattention": 1,
    //      "title": "",
    //      "userdesc": "",
    //      "userid": 6098853,
    //      "username": "无限试驾",
    //      "userpic": "https://www2.autoimg.cn/youchuang/g8/M03/72/85/autohomecar__wKjBz1j-ueuAOxqEAALIEZP3Ens630.jpg"
    //    },  {
    //      "fansnum": "",
    //      "isattention": 0,
    //      "title": "",
    //      "userdesc": "",
    //      "userid": 18759205,
    //      "username": "卡尔本次",
    //      "userpic": ""

    //    }]

    //  },
    //  "returncode": 0
    //}
    //vm.data.loadMore = res.result.loadMore;
    //index = index || 0;
    //vm.data.lastId[index] = res.result.lastId;
    //vm.renderFollowMoreList(res.result.users, index);
    //return;
    vm.ajax({
      url: vm.data.url + '/getUserPageByCategory.json',
      type: "GET",
      data: {
        userCategoryId: id,
        size: 30,
        lastId: vm.data.lastId[index] || ''
      },
      dataType: "json",
      success: function(res, xml) {
        res = JSON.parse(res);
        if (!!res.result.users.length) {
          vm.data.loadMore = res.result.loadMore;

          vm.data.lastId[index] = res.result.lastId;
          vm.renderFollowMoreList(res.result.users, index);
        }
      },
      fail: function(status) {}
    });
  },

  //渲染关注更多list
  renderFollowMoreList: function(data, index) {
    index = index || 0;
    var html = '';

    /*
        try{
              data.map(function(v) {
                html += '<li > <a class="c-att-href ' + (v['isattention'] == '1' ? 'on' : '') + '" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertitle=' + v['title'] + ' userdesc=' + v['userdesc'] + ' href="javascript:;" usertime=' + v['createtime'] + '>' + (!!v['isattention'] ? '已关注' : '+ 关注') + '</a> <img src="' + v['userpic'] + '" alt=""> <h3 class="c-att-title">' + v['username'] + '</h3> <p class="c-att-fans">' + v['fansnum'] + '粉丝</p> <p class="c-att-info">' + v['userdesc'] + '</p> </li>';
              })
              if (!vm.data.isLoad) {
                $('.js-follow-more-list ul').eq(index).append(html);
              } else {
                $('.js-follow-more-list ul').eq(index).html(html);
              }

              $('.c-loading').hide();
              vm.data.isLoad = true;

              if(!vm.data.registLoad){
                return;
              }
              $('.js-follow-v-list').on('scroll',function(e){
                vm.data.registLoad = false;

                var $target = e.currentTarget;

                var $scrollHeight = $($target)[0].scrollHeight;
                var $height = $($target).height();
                var $scrollTop = $target.scrollTop; 

                if($height + $scrollTop >= $scrollHeight){
                  if(!!vm.data.isLoad){
                  vm.data.isLoad = false;
                    $('.c-loading').show();
                    if(!!vm.data.loadMore){
                      vm.getFollowMoreList(vm.data.followMoreId, vm.data.followMoreIndex);
                    }else{
                      $('.c-loading').hide();
                    }
                  }
                }
              })
              
            }catch(e){
            }

            return;
            */
    //本地关注与线上数据判断已关注过滤
    //登录未登录 

    ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
      var html = '';

      //未登录 
      if (!Number(user.userId)) {
        ApiBridge.callNative("ClientDataManager", "getLocalDataForFollow", {}, function(follow) {

          //本地数据有
          //to do
          if (!!follow.result.length) {
            follow.result.map(function(v) {
              data.map(function(j) {
                if (v['userId'] == j['userid']) {
                  j['isattention'] = '1';
                }
              })
            })
          }
          data.map(function(v) {
            html += '<li > <a class="c-att-href ' + (v['isattention'] == '1' ? 'on' : '') + '" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertitle=' + v['title'] + ' userdesc=' + v['userdesc'] + ' href="javascript:;" usertime=' + v['createtime'] + '>' + (!!v['isattention'] ? '已关注' : '+ 关注') + '</a> <img src="' + v['userpic'] + '" alt=""> <h3 class="c-att-title">' + v['username'] + '</h3> <p class="c-att-fans">' + (!!v['fansnum'] ? (v['fansnum'] + '粉丝') : '') + '</p> <p class="c-att-info">' + v['userdesc'] + '</p> </li>';
          });

          if (!vm.data.isLoad) {
            $('.js-follow-more-list ul').eq(index).append(html);
          } else {
            $('.js-follow-more-list ul').eq(index).html(html);
          }

          $('.c-loading').hide();
          vm.data.isLoad = true;
          if (!vm.data.registLoad) {
            return;
          }
          $('.js-follow-v-list').on('scroll', function(e) {
            vm.data.registLoad = false;

            var $target = e.currentTarget;

            var $scrollHeight = $($target)[0].scrollHeight;
            var $height = $($target).height();
            var $scrollTop = $target.scrollTop;

            if ($height + $scrollTop >= $scrollHeight) {
              //断网
              ApiBridge.callNative("ClientDataManager", "getNetworkState", {}, function(state) {
                vm.data.isNet = state.result;
                if (!Number(vm.data.isNet)) {
                  if (!!vm.data.isLoad) {
                    vm.data.isLoad = false;
                    ApiBridge.callNative("ClientViewManager", "showErrorTipsViewForNoNetWork", {
                      top: 'topNavTop'
                    }, function() {
                      vm.data.isLoad = true;
                    })
                  }
                } else {
                  if (!!vm.data.isLoad) {
                    vm.data.isLoad = false;
                    $('.c-loading').show();
                    if (!!vm.data.loadMore) {
                      vm.getFollowMoreList(vm.data.followMoreId, vm.data.followMoreIndex);
                    } else {
                      $('.c-loading').hide();
                    }
                  }
                }
              })
            }
          })
        })
      } else {
        try {
          data.map(function(v) {
            html += '<li > <a class="c-att-href ' + (v['isattention'] == '1' ? 'on' : '') + '" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertitle=' + v['title'] + ' userdesc=' + v['userdesc'] + ' href="javascript:;" usertime=' + v['createtime'] + '>' + (!!v['isattention'] ? '已关注' : '+ 关注') + '</a> <img src="' + v['userpic'] + '" alt=""> <h3 class="c-att-title">' + v['username'] + '</h3> <p class="c-att-fans">' + (!!v['fansnum'] ? (v['fansnum'] + '粉丝') : '') + '</p> <p class="c-att-info">' + v['userdesc'] + '</p> </li>';
          })
          if (!vm.data.isLoad) {
            $('.js-follow-more-list ul').eq(index).append(html);
          } else {
            $('.js-follow-more-list ul').eq(index).html(html);
          }

          $('.c-loading').hide();
          vm.data.isLoad = true;

          if (!vm.data.registLoad) {
            return;
          }
          $('.js-follow-v-list').on('scroll', function(e) {
            vm.data.registLoad = false;

            var $target = e.currentTarget;

            var $scrollHeight = $($target)[0].scrollHeight;
            var $height = $($target).height();
            var $scrollTop = $target.scrollTop;

            if ($height + $scrollTop >= $scrollHeight) {

              ApiBridge.callNative("ClientDataManager", "getNetworkState", {}, function(state) {
                vm.data.isNet = state.result;
                if (!Number(vm.data.isNet)) {
                  if (!!vm.data.isLoad) {
                    vm.data.isLoad = false;
                    ApiBridge.callNative("ClientViewManager", "showErrorTipsViewForNoNetWork", {
                      top: 'topNavTop'
                    }, function() {
                      vm.data.isLoad = true;
                    })
                  }
                } else {
                  if (!!vm.data.isLoad) {
                    vm.data.isLoad = false;
                    $('.c-loading').show();
                    if (!!vm.data.loadMore) {
                      vm.getFollowMoreList(vm.data.followMoreId, vm.data.followMoreIndex);
                    } else {
                      $('.c-loading').hide();
                    }
                  }
                }
              })
            }
          })

        } catch (e) {}
      }

      //解决第一次加载不能点击问题, ps:具体原因不明,应该和事件委托无关
      if (!!vm.data.isFollowMore) {
        $('.js-follow-more-bar li').eq(0).click();
        vm.data.isFollowMore = false;
      }
    })
  },

  //渲染标签详情列表
  renderTagList: function(data, index) {
    index = index || 0;
    if (!!data.length) {
      var html = '';

      /*
      data.map(function(v) {
        if (v['mediatype'] == 4) {
          html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userId=' + v['userid'] + ' class=media-audio>' + '<a class="c-att-t" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '>' + (v['isattention'] == 1 ? '已关注' : '+ 关注') + '</a>' + '<div class=c-media-info><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<div class="c-media-audio">' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + '<img class="c-auth-info-img" src=' + v['indexdetail'] + ' alt=""></div><span class="c-tab-jj ">' + ((v['mediatype'] == 1 || v['mediatype'] == 4 || v['mediatype'] == 3) ? v['title'] : v['description']) + '</span></div>' + '<p class="span c-tab-ue">' + '<span class="c-zan"><span class="zan-icon"></span><span class="c-num">' + v['praisenum'] + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + v['replycount'] + '</span></span>' + '</p>' + '<span class="c-looked">' + v['pv'] + ' 浏览</span>' + '</li>';
        } else {
          html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userId=' + v['userid'] + ' >' + '<a class="c-att-t" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + ' >' + (v['isattention'] == 1 ? '已关注' : '+ 关注') + '</a>' + '<div class=c-media-info><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<p class="c-tab-jj ' + (v['mediatype'] == 1 ? 'short' : 'long') + '">' + ((v['mediatype'] == 1 || v['mediatype'] == 4 || v['mediatype'] == 3) ? v['title'] : v['description']) + '</p>' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + '<img class="c-auth-info-img" src=' + v['indexdetail'] + ' alt=""></div>' + '<p class="span c-tab-ue">' + '<span class="c-zan"><span class="zan-icon"></span><span class="c-num">' + v['praisenum'] + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + v['replycount'] + '</span></span>' + '</p>' + '<span class="c-looked">' + v['pv'] + ' 浏览</span>' + '</li>';
        }
      })

      if (!vm.data.isLoad) {
        $('.c-tab-bd ul').eq(index).append(html);
      } else {
        $('.c-tab-bd ul').eq(index).html(html);
      }

      $('.c-loading').hide();
      vm.data.isLoad = true;

      return;
      */

      //本地关注与线上数据判断已关注过滤
      //登录未登录 

      ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
        var html = '';

        //未登录 
        if (!Number(user.userId)) {
          ApiBridge.callNative("ClientDataManager", "getLocalDataForFollow", {}, function(follow) {

            //本地数据有
            if (!!follow.result.length) {
              follow.result.map(function(v) {
                data.map(function(j) {
                  if (v['userId'] == j['userid']) {
                    j['isattention'] = '1';
                  }
                })
              })
            }
            data.map(function(v) {
              if (v['mediatype'] == 4) {
                html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userId=' + v['userid'] + ' class=media-audio>' + '<a class="c-att-t ' + (v['isattention'] == '1' ? 'on' : '') + '" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '>' + (v['isattention'] == 1 ? '已关注' : '+ 关注') + '</a>' + '<div class=c-media-info><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<div class="c-media-audio">' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + '<img class="c-auth-info-img" src=' + v['indexdetail'] + ' alt=""></div><span class="c-tab-jj ">' + ((v['mediatype'] == 3 || v['mediatype'] == 1 || v['mediatype'] == 4) ? v['title'] : v['description']) + '</span></div>' + '<p class="span c-tab-ue">' + '<span class="c-zan"><span class="zan-icon"></span><span class="c-num">' + v['praisenum'] + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + v['replycount'] + '</span></span>' + '</p>' + '<span class="c-looked">' + v['pv'] + ' 浏览</span>' + '</li>';
              } else {
                html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userId=' + v['userid'] + ' >' + '<a class="c-att-t ' + (v['isattention'] == '1' ? 'on' : '') + '" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + ' >' + (v['isattention'] == 1 ? '已关注' : '+ 关注') + '</a>' + '<div class=c-media-info><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<p class="c-tab-jj ' + (v['mediatype'] == 1 ? 'short' : 'long') + '">' + ((v['mediatype'] == 3 || v['mediatype'] == 4 || v['mediatype'] == 1) ? v['title'] : v['description']) + '</p>' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + '<img class="c-auth-info-img" src=' + v['indexdetail'] + ' alt=""></div>' + '<p class="span c-tab-ue">' + '<span class="c-zan"><span class="zan-icon"></span><span class="c-num">' + v['praisenum'] + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + v['replycount'] + '</span></span>' + '</p>' + '<span class="c-looked">' + v['pv'] + ' 浏览</span>' + '</li>';
              }
            })

            if (!vm.data.isLoad) {
              $('.c-tab-bd ul').eq(index).append(html);
            } else {
              $('.c-tab-bd ul').eq(index).html(html);
            }

            $('.c-loading').hide();
            vm.data.isLoad = true;
          })
        } else {
          data.map(function(v) {
            if (v['mediatype'] == 4) {
              html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userId=' + v['userid'] + ' class=media-audio>' + '<a class="c-att-t ' + (v['isattention'] == '1' ? 'on' : '') + '" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '>' + (v['isattention'] ? '已关注' : '+ 关注') + '</a>' + '<div class=c-media-info><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<div class="c-media-audio">' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + '<img class="c-auth-info-img" src=' + v['indexdetail'] + ' alt=""></div><span class="c-tab-jj ">' + ((v['mediatype'] == 3 || v['mediatype'] == 4 || v['mediatype'] == 1) ? v['title'] : v['description']) + '</span></div>' + '<p class="span c-tab-ue">' + '<span class="c-zan"><span class="zan-icon"></span><span class="c-num">' + v['praisenum'] + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + v['replycount'] + '</span></span>' + '</p>' + '<span class="c-looked">' + v['pv'] + ' 浏览</span>' + '</li>';
            } else {
              html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userId=' + v['userid'] + ' >' + '<a class="c-att-t ' + (v['isattention'] == '1' ? 'on' : '') + '" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + ' >' + (v['isattention'] ? '已关注' : '+ 关注') + '</a>' + '<div class=c-media-info><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title"></div>' + v['username'] + '</p>' + '<p class="c-tab-jj ' + (v['mediatype'] == 1 ? 'short' : 'long') + '">' + ((v['mediatype'] == 3 || v['mediatype'] == 1 || v['mediatype'] == 4) ? v['title'] : v['description']) + '</p>' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + '<img class="c-auth-info-img" src=' + v['indexdetail'] + ' alt=""></div>' + '<p class="span c-tab-ue">' + '<span class="c-zan"><span class="zan-icon"></span><span class="c-num">' + v['praisenum'] + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + v['replycount'] + '</span></span>' + '</p>' + '<span class="c-looked">' + v['pv'] + ' 浏览</span>' + '</li>';
            }
          })

          if (!vm.data.isLoad) {
            $('.c-tab-bd ul').eq(index).append(html);
          } else {
            $('.c-tab-bd ul').eq(index).html(html);
          }
          $('.c-loading').hide();
          vm.data.isLoad = true;
        }
      })
    }
  }
};
vm.bindEvent();


//本地数据页码
vm.data.localNextIndex = 0;

//滚动默认为true;
vm.data.isLoad = true;
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

if (/author/.test(window.location.href)) {
  ApiBridge.callNative('ClientNavigationManager', 'setRightIcon', {
    righticons: {
      icon1: 'articleplatform_icon_share_w',
      icon1_p: 'articleplatform_icon_share_w_p'
    }
  }, function() {
    ApiBridge.callNative('ClientViewManager', 'shareAction');
    //to do share
  })
}

//关注更多
if (/follow-more-tab/.test(window.location.href)) {
  vm.data.isFollowMore = true;

  vm.data.registLoad = true;
  vm.getFollowMoreBar();

  vm.data.lastId = [];

}

//标签列表
if (/tag-name/.test(window.location.href)) {
  //to do 本地存储点赞
  vm.data.likes = [];

  //存储media id
  vm.data.mediaId = [];

  //上拉翻页加载
  vm.upScroll(function() {
    if (!!vm.data.isLoad) {
      vm.data.isLoad = false;
      $('.c-loading').show();
      //删除视频 
      ApiBridge.callNative('ClientVideoManager', 'deleteById', {
        mediaid: vm.data.mediaid,
      });
      //删除音频 
      ApiBridge.callNative('ClientAudioManager', 'deleteById', {
        mediaid: vm.data.mediaid,
      });
      vm.tagList(vm.data.tagListIndex);
    }
  });

  //监听销毁视频
  vm.deleteVideo();

  //默认请求数据
  vm.tagList();

  //下拉刷新
  vm.reFresh.init({
    container: '.container',
    beforePull: function() {
      console.log('beforePull')
        //删除视频 
      ApiBridge.callNative('ClientVideoManager', 'deleteById', {
        mediaid: vm.data.mediaid,
      });
    },
    onRefresh: function() {
      vm.tagList(vm.data.tagListIndex);
      console.log('onRefresh')
      $('.js-tag-list').addClass('on');
      $('#pullIcon').addClass('anima')
      $('.pull-ab').addClass('rotate')
    },
    afterPull: function() {
      console.log('afterPulll')
      $('.js-tag-list').removeClass('on');
    },
  })
}

//tab切换
vm.tab('.js-td', '.js-tb')
ApiBridge.callNative('ClientViewManager', 'hideLoadingView')
