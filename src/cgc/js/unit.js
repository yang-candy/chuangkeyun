;
var vm = {
  data: {},

  //绑定事件
  bindEvent: function() {

    //点击关注 或者 跳转作者客页
    $('.js-follow-v-list').on('click', 'li', vm.author2);
    $('.js-follow-list').on('click', 'li', vm.author2);

    //通用关注
    $('.js-tag-list').on('click', '.c-att-t', vm.tagFollow);

    //标签列表 --评论跳转到评论页
    $('.js-tag-list').on('click', '.c-common', vm.tagCommon);

    //标签列表 --跳转文章最终页
    $('.js-tag-list').on('click', 'li', vm.artical);

    //标签列表 --点击头像或名字跳转个人主页
    $('.js-tag-list').on('click', '.c-auth-img', vm.author2);
    $('.js-tag-list').on('click', '.c-auth-title', vm.author2);

    //标签列表 --点赞动作
    $('.js-tag-list').on('click', '.c-zan', vm.likeZan);

    //点击Tag获得TagId对应的News列表
    $('.js-tag-title').on('click', 'li', vm.getTagContent);

    //跳转关注更多
    $('.c-att-more').on('click', vm.followV);

    //点击关注更多左侧bar 获取右侧list
    $('.js-follow-more-bar').on('click', 'li', vm.getFollowMore);

  },
  getFollowMore: function(e){
    e.stopPropagation();
    var $target = $(e.target);
    
    vm.getFollowMoreList($target.attr('ids'), $target.index());
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
    if (e.target.tagName != 'LI') {
      return;
    }
    console.log('li')
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
    console.log('author2')
    $target = $(e.currentTarget);

    $followTarget = e.target;

    //点了关注
    if ($followTarget.tagName == 'A') {
      var $type = $(e.target).hasClass('on') ? 1 : 0;
      var $info = {
        imgurl: $($followTarget).attr('userpic'),
        time: $($followTarget).attr('usertime') || '',
        userid: $($followTarget).attr('userid'),
        title: $($followTarget).attr('title'),
        description: $($followTarget).attr('userdesc') || '',
        username: $($followTarget).attr('username')
      }
      ApiBridge.log($target.attr('userid'))
      vm.followToggle($($followTarget).attr('userid'), $type, $info, $($followTarget));
      return;
    }
    //跳转到作者客页
    ApiBridge.callNative('ClientViewManager', 'pushViewController', {
      pagetype: 7,
      animationtype: 1,
      set: {
        modename: 'author',
        navigationtype: 2
      },
      param: {
        userId: $target.attr('userId')
      }
    });
  },
  tagFollow: function(e) {
    e.stopPropagation();
    $target = $(e.currentTarget);

    $followTarget = e.target;

    //点了关注
    if ($followTarget.tagName == 'A') {
      var $type = $(e.target).hasClass('on') ? 1 : 0;
      var $info = {
        imgurl: $($followTarget).attr('userpic'),
        time: $($followTarget).attr('usertime') || '',
        userid: $($followTarget).attr('userid'),
        title: $($followTarget).attr('usertitle'),
        description: $($followTarget).attr('userdesc') || '',
        username: $($followTarget).attr('username')
      }
      ApiBridge.log($target.attr('userid'))
      vm.followToggle($($followTarget).attr('userid'), $type, $info, $($followTarget));
    }
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
            ApiBridge.log(res)
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
        ApiBridge.log(JSON.stringify(info))
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
        html += '<li > <a class="c-att-href" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertitle=' + v['title'] + ' userdesc=' + v['userdesc'] + ' href="javascript:;" usertime=' + v['createtime'] + '>＋关注</a> <img src="' + v['userpic'] + '" alt=""> <h3 class="c-att-title">' + v['username'] + '</h3> <p class="c-att-fans">' + v['fansnum'] + '粉丝</p> <p class="c-att-info">' + v['userdesc'] + '</p> </li>';
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
      title: '我的关注',
      navigationtype: 2
    });

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
            vm.followAjax("http://news.app.autohome.com.cn/chejiahao_v1.0.0/newspf/npgetvuserlist.json", {
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
                vm.followAjax("http://news.app.autohome.com.cn/chejiahao_v1.0.0/newspf/npgetvuserlist.json", {
                  dt: 1,
                  vids: ids.toString()
                })
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
  localNextPage: function() {
    vm.data.localNextIndex++;
    ApiBridge.log(vm.data.localNextIndex)
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
            vm.followAjax("http://news.app.autohome.com.cn/chejiahao_v1.0.0/newspf/npgetvuserlist.json", {
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
              ApiBridge.log(vm.data.localDataLength)
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
    /*var res = {
      "message": "",
      "result": {
        "isloadmore": true,
        "lastid": "2017-05-10 13:52:08247|100112",
        "newslist": [{
          "content": "",
          "description": "",
          "identifiertype": "",
          "imageheight": 0,
          "imagewidth": 0,
          "indexdetail": ["https://qnwww2.autoimg.cn/youchuang/g11/M04/98/E4/autohomecar__wKgH0lkTz3iAHr29AAFQYzWEEz4983.jpg?imageView2/2/w/640"],
          "isattention": 0,
          "iscandelete": 0,
          "mediaid": "",
          "mediatype": 1,
          "newsid": 100251,
          "pics": [],
          "playtime": "",
          "praisenum": 0,
          "publishtime": "2017-05-11",
          "replycount": "0",
          "seriesids": "",
          "session_id": "0ab92236c6dc4226b7a2a21c77ad79ac",
          "status": 0,
          "statusNote": "",
          "statusStr": "",
          "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g11/M04/98/E4/autohomecar__wKgH0lkTz3iAHr29AAFQYzWEEz4983.jpg?imageView2/1/w/400/h/225"],
          "title": "这是比缸内直喷更好的引擎技术?",
          "userid": 26459902,
          "username": "CLauto酷乐汽车",
          "userpic": "https://qnwww2.autoimg.cn/youchuang/g8/M07/BE/EC/autohomecar__wKgHz1hKfReAbtwLAACQ18qIPGc329.JPG?imageView2/1/w/120/h/120"

        }, {
          "content": "",
          "description": "",
          "identifiertype": "",
          "imageheight": 0,
          "imagewidth": 0,
          "indexdetail": ["https://qnwww2.autoimg.cn/youchuang/g19/M03/72/E5/autohomecar__wKgFU1kSq6SAUQ8MAAGZQVgzY10917.jpg?imageView2/2/w/640"],
          "isattention": 0,
          "iscandelete": 0,
          "mediaid": "",
          "mediatype": 1,
          "newsid": 100113,
          "pics": [],
          "playtime": "",
          "praisenum": 2,
          "publishtime": "2017-05-10",
          "replycount": "2",
          "seriesids": "",
          "session_id": "50ba8bd244964a14a665e3a59b2bf519",
          "status": 0,
          "statusNote": "",
          "statusStr": "",
          "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g19/M03/72/E5/autohomecar__wKgFU1kSq6SAUQ8MAAGZQVgzY10917.jpg?imageView2/1/w/400/h/225"],
          "title": "速度与激情8莱蒂姐的战斗机",
          "userid": 28402669,
          "username": "第九车道",
          "userpic": "https://qnwww2.autoimg.cn/youchuang/g9/M0A/81/BF/autohomecar__wKgH31j-7wyAfHr2AAce2W4iTVA803.jpg?imageView2/1/w/120/h/120"

        }, {
          "content": "",
          "description": "",
          "identifiertype": "",
          "imageheight": 0,
          "imagewidth": 0,
          "indexdetail": ["https://qnwww2.autoimg.cn/youchuang/g19/M07/72/E1/autohomecar__wKgFU1kSqeSAMQnkAB9MVa-ekO0287.jpg?imageView2/2/w/640"],
          "isattention": 0,
          "iscandelete": 0,
          "mediaid": "",
          "mediatype": 1,
          "newsid": 100112,
          "pics": [],
          "playtime": "",
          "praisenum": 0,
          "publishtime": "2017-05-10",
          "replycount": "0",
          "seriesids": "",
          "session_id": "b8894f0d80c346d3b3d5fc1e0cd03392",
          "status": 0,
          "statusNote": "",
          "statusStr": "",
          "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g19/M07/72/E1/autohomecar__wKgFU1kSqeSAMQnkAB9MVa-ekO0287.jpg?imageView2/1/w/400/h/225"],
          "title": "福特 福克斯 RS v 日产 GT-R | 冠军杀手（六）",
          "userid": 25682175,
          "username": "汽车与运动evo",
          "userpic": "https://qnwww2.autoimg.cn/youchuang/g16/M0E/00/AE/autohomecar__wKjBx1iZPTWAM2HJAALWRcM5dJs218.jpg?imageView2/1/w/120/h/120"

        }]

      },
      "returncode": 0

    };
    vm.renderTagList(res.result.newslist, index);
    return;
    */
    vm.ajax({
      url: 'http://news.app.autohome.com.cn/chejiahao_v1.0.0/newspf/npnewlistfortagid.json',
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
    vm.ajax({
      url: 'http://news.app.autohome.com.cn/chejiahao_v1.0.0/newspf/getCategoryList.json',
      type: "GET",
      data: {},
      dataType: "json",
      success: function(res, xml) {
        res = JSON.parse(res);
        if (!!res.result.length) {
          vm.renderFollowMoreBar(res.result);
        }
      },
      fail: function(status) {}
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

    $('.js-follow-more-bar').html(html);
    $('.js-follow-more-list').html(html);

    vm.getFollowMoreList($('.js-follow-more-bar li').eq(0).attr('ids'), $('.js-follow-more-bar').index());
  },

  //获取关注更多第一个的关注列表
  getFollowMoreList: function(id, index) {
    vm.ajax({
      url: 'http://news.app.autohome.com.cn/chejiahao_v1.0.0/newspf/getUserPageByCategory.json',
      type: "GET",
      data: {
        userCategoryId: id,
        size: 20,
        lastId: vm.data.lastId || ''
      },
      dataType: "json",
      success: function(res, xml) {
        res = JSON.parse(res);
        if (!!res.result.length) {
          vm.renderFollowMoreList(res.result, index);
        }
      },
      fail: function(status) {}
    });
  },

  //渲染关注更多list
  renderFollowMoreList: function(data, index) {
    index = index || 0;

    var html = '';
    data.map(function(v) {
      html += '<li > <a class="c-att-href" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertitle=' + v['title'] + ' userdesc=' + v['userdesc'] + ' href="javascript:;" usertime=' + v['createtime'] + '>＋关注</a> <img src="' + v['userpic'] + '" alt=""> <h3 class="c-att-title">' + v['username'] + '</h3> <p class="c-att-fans">' + v['fansnum'] + '粉丝</p> <p class="c-att-info">' + v['userdesc'] + '</p> </li>';
    })

    $('.js-follow-more-list ul').eq(index).html(html);
  },

  //渲染标签详情列表
  renderTagList: function(data, index) {
    index = index || 0;
    if (!!data.length) {
      var html = '';
      data.map(function(v) {
        html +=
          '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userId=' + v['userid'] + '>' + '<a class="c-att-t" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + ' href="javascript:;">' + (v['isattention'] ? '已关注' : '+ 关注') + '</a>' + '<img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p>' + '<p class="c-tab-jj ' + (v['mediatype'] == 1 ? 'short' : 'long') + '">' + (v['mediatype'] == (3 || 4) ? v['title'] : v['description']) + '</p>' + '<img class="c-auth-info-img" src=' + v['indexdetail'] + ' alt="">' + '<p class="span c-tab-ue">' + '<span class="c-zan"><span class="zan-icon"></span><span class="c-num">' + v['praisenum'] + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + v['replycount'] + '</span></span>' + '</p>' + '<span class="c-looked">' + v['pv'] + ' 浏览</span>' + '</li>'
      })

      if (!vm.data.isLoad) {
        $('.c-tab-bd ul').eq(index).append(html);
      } else {
        $('.c-tab-bd ul').eq(index).html(html);
      }
    }
    $('.c-loading').hide();
    vm.data.isLoad = true;


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

//加载更多
if (/follow-more-tab/.test(window.location.href)) {
  vm.getFollowMoreBar();
}

//标签列表
if (/tag-name/.test(window.location.href)) {
  vm.data.likes = [];

  //上拉加载
  vm.upScroll(function() {
    if (!!vm.data.isLoad) {
      vm.data.isLoad = false;
      $('.c-loading').show();
      vm.tagList();
    }
  });

  //默认请求数据
  vm.tagList();

  //下拉刷新
  vm.reFresh.init({
    container: '.container',
    beforePull: function() {
      console.log('beforePull')
    },
    onRefresh: function() {
      vm.tagList(vm.data.tagListIndex);
      console.log('beforePull')
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
