;
var vm = {
  data: {
    url: 'http://chejiahao.app.autohome.com.cn/chejiahao_v1.0.0/newspf'
  },

  getQingInfo: function(e) {
    e.stopPropagation();
    $target = $(e.currentTarget);

    if ($target.attr('imgnum') < 3) {
      return;
    }

    $parent = $target.parent('.c-qing-img-wp');

    var pics = [];
    var picurl = $parent.attr('picurl').split(',');
    $.map(picurl, function(item) {
      var map = {};
      map.picurl = item;

      pics.push(map);
    });

    ApiBridge.callNative('ClientViewManager', 'pushViewController', {
      pagetype: 9,
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
        newsid: $parent.attr('newsid'),
        index: $target.index(),
        pics: pics,
        sharecontent: $parent.attr('sharecontent')
      }
    });
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
        //if (vm.data.isFollowMore) {
        //  return;
        //}
        if ($('.js-follow-more-list ul').eq($target.index()).html() == '') {
          vm.getFollowMoreList($target.attr('ids'), $target.index());
        }
      }
    })
  },

  //根据wifi 判断是否创建播放器
  isCreatePlayer: function(fn) {
    if(vm.mobileType() !== 'iOS'){
      fn && fn();
    } else {
      ApiBridge.callNative("ClientDataManager", "getWifiState", {}, function(state) {
        ApiBridge.log(state)
        if (!state.result) {
           ApiBridge.log('isCreatePlayer if')
          ApiBridge.callNative('ClientDataManager', 'getVideoShowAlertState', {}, function(data) {
           
            if (!data.result) {
              ApiBridge.callNative('ClientToastManager', 'showAlert', {}, function(info) {
                if (!!info.result) {
                  fn && fn();
                }
              })
            }else{
              fn && fn();
            }
          })
        }else{
          ApiBridge.log('isCreatePlayer else')
          fn && fn();
        }
      })
    }
  },
  createMedia: function(e) {
    e.stopPropagation();
    var $target = $(e.currentTarget);
    vm.data.mediaid = $(e.currentTarget).attr('mediaid');
    
    ApiBridge.log('createMedia start')
    ApiBridge.callNative("ClientDataManager", "getNetworkState", {}, function(state) {
      vm.data.isNet = state.result;

      //未联网
      if (!Number(vm.data.isNet)) {
        ApiBridge.callNative('ClientViewManager', 'showToastView', {
          type: 0,
          msg: '当前网络不可用，请检查网络设置'
        })
      } else {
        vm.isCreatePlayer(function() {
          var borderWidth = Number($(e.currentTarget).css('border-width').substr(0, 1));
          vm.data.mediaStatus = true;
          vm.data.mediaid = $(e.currentTarget).attr('mediaid');
          vm.data.mediatype = $(e.currentTarget).attr('mediatype');
          vm.data.mediatitle = $(e.currentTarget).attr('title');
          vm.data.mediaWidth = $(e.currentTarget).find('img').width() + 2 * borderWidth;
          vm.data.mediaHeight = $(e.currentTarget).find('img').height() + 2 * borderWidth;
          vm.data.mediaX = $(e.currentTarget).find('img')[0].x - borderWidth;
          vm.data.mediaY = $(e.currentTarget).find('img')[0].y - borderWidth;
          ApiBridge.log('createMedia net')
          //- document.body.scrollTop;
          if ($target.attr('status') != 0 && $target.attr('status') != 1) {
            ApiBridge.log('createMedia return')
            return;
          }
          // var targetEl = $target.find('.c-tag-video');
          // var audioEl = $('.js-tag-list').find('.c-tag-audio');

          // if (audioEl.length) {
          //   audioEl.map(function(index, item) {
          //     $(item).removeClass('c-tag-audio');
          //   })
          // }

          var postData = {
            mediaid: vm.data.mediaid,
            width: vm.data.mediaWidth,
            height: vm.data.mediaHeight,
            title: vm.data.mediatitle,
            x: vm.data.mediaX,
            y: vm.data.mediaY,
            status: $target.attr('status'),
            playtime: $target.attr('playtime'),
            thumbnailpics: $target.attr('thumbnailpics').split(',')
          }

          if (vm.data.mediatype == 3) {
            ApiBridge.log('createMedia 3')
            ApiBridge.callNative('ClientVideoManager', 'createById', postData);
          }
          if (vm.data.mediatype == 4) {
            ApiBridge.log('createMedia 4')
            ApiBridge.callNative('ClientAudioManager', 'createById', postData);
            // $(targetEl).addClass('c-tag-audio');
          }
        })
      }
    })
  },

  //监听销毁音频或视频
  deleteMediaWatch: function(e) {
    window.addEventListener('scroll', function() {
      var offsetHeight = window.innerHeight,
        scrollTop = document.body.scrollTop;
      var $titleHeight = $('.js-tag-title').height();

      if (!!vm.data.mediaStatus) {
        if ((vm.data.mediaHeight + vm.data.mediaY - $titleHeight) < scrollTop || (vm.data.mediaY - offsetHeight > scrollTop)) {
          vm.data.mediaStatus = false;
          console.log('delete')
          if (vm.data.mediatype == 3) {
            ApiBridge.callNative('ClientVideoManager', 'deleteById', {
              mediaid: vm.data.mediaid,
            });
          }

          // if (vm.data.tagListIndex == 0 || vm.data.tagListIndex == 4) {
          //   ApiBridge.callNative('ClientAudioManager', 'deleteById', {
          //     mediaid: vm.data.mediaid,
          //   });
          // }
          // if (vm.data.mediatype == 4) {

          //   ApiBridge.callNative('ClientAudioManager', 'deleteById', {
          //     mediaid: vm.data.mediaid,
          //   });

          //   var audioEl = $('.js-tag-list').find('.c-tag-audio');

          //   if(audioEl.length){
          //     audioEl.map(function(index, item){
          //       $(item).removeClass('c-tag-audio');
          //     })
          //   }
          // }
        }
      }
    });
  },

  //销毁音频或视频
  deleteMedia: function(e) {
    if (vm.data.tagListIndex + 1 == 4) {
      ApiBridge.callNative('ClientVideoManager', 'deleteById', {
        mediaid: vm.data.mediaid,
      });
    }
    if (vm.data.tagListIndex + 1 == 3) {

      ApiBridge.callNative('ClientAudioManager', 'deleteById', {
        mediaid: vm.data.mediaid,
      });

      // var audioEl = $('.js-tag-list').find('.c-tag-audio');

      // if (audioEl.length) {
      //   audioEl.map(function(index, item) {
      //     $(item).removeClass('c-tag-audio');
      //   })
      // }
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

  zanHandler: function($target) {
    $target.attr('hasZan', 'true');

    var num = Number($target.find('.c-num').html());
    num++;
    $target.find('.c-num').html(num);

    var html = '<span class="c-add1">+1</span>'
    $target.append(html);

    //记录点赞
    vm.data.likes.push($target.parents('li').attr('userid'));
    vm.setLs('tagliked', vm.data.likes)

    setTimeout(function() {
      $('.c-add1').remove();
    }, 1000)

    $target.find('.zan-icon').addClass('on');
    setTimeout(function() {
      $target.find('.zan-icon').removeClass('on')
      $target.find('.zan-icon').addClass('on-no-inmation')
    }, 1000);

    ApiBridge.callNative("ClientDataManager", "getSystemConstant", {}, function(follow) {

      ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
        vm.ajax({
          url: 'https://reply.autohome.com.cn/api/like/set.json?encode=utf-8',
          type: "POST",
          isJson: true,
          data: {
            appid: '21',
            _appid: vm.mobileType() == 'iOS' ? 'app' : 'app_android',
            liketype: '1',
            objid: $target.attr('newsid'),
            secobj: '',
            sessionid: follow.uniqueDeviceIMEI,
            autohomeua: user.userAgent,
            authorization: user.userAuth,
            extdata: ''
          },
          dataType: "json",
          success: function(res, xml) {
            $target.attr('hasZan', 'true');
          },
          fail: function(status) {
            $target.attr('hasZan', 'false');
          }
        });
      })

    })
  },
  likeZan: function(e) {
    e.stopPropagation();
    $target = $(e.currentTarget);
    if (!!$target.attr('hasZan')) {
      return;
    }
    if ($target.find('.zan-icon').hasClass('on-no-inmation')) {
      return;
    };

    ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
      if (!Number(user.userId)) {
        ApiBridge.callNative('ClientViewManager', 'login', {}, function(res) {
          if (res.result == 1) {
            vm.zanHandler($target);
          }
        })
      } else {
        vm.zanHandler($target);
      }
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
        newsid: $target.attr('newsid'),
        type: $target.attr('type'),
        autoscrolltocomment: 1
      }
    });
  },
  // 关注不关注
  followToggle: function(userid, type, info, target) {
    ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
      //已登录
      if (Number(user.userId)) {
        if (!type) {
          var $url = 'https://chejiahaoopen.api.autohome.com.cn/OpenUserService.svc/Follow';
        } else {
          var $url = 'https://chejiahaoopen.api.autohome.com.cn/OpenUserService.svc/UnFollow';
        }
        vm.ajax({
          url: $url,
          type: "POST",
          isJson: true,
          data: {
            userId: userid,
            _appid: vm.mobileType() == 'iOS' ? 'app' : 'app_android',
            pcpopclub: user.userAuth,
            autohomeua: user.userAgent
          },
          dataType: "json",
          success: function(res, xml) {
            res = JSON.parse(res);
            if (!!res.result) {
              if ((!!info.icon1) || (/author/.test(window.location.href))) {
                var icon1 = {
                  icon1: !type ? 'articleplatform_icon_correct' : 'articleplatform_icon_add',
                  icon1_p: !type ? 'articleplatform_icon_correct_p' : 'articleplatform_icon_add_p',
                };

                vm.setRightIcon(icon1);

                //target = !!$('.c-att-href').length ? $('.c-att-href') : $('.c-auth-follow');
              }

              if (!type) {
                target.addClass('on');
                target.html('已关注')
                ApiBridge.callNative('ClientViewManager', 'showToastView', {
                  type: 1,
                  msg: '关注成功'
                });
                //判断流
                if (/tag-name/.test(window.location.href)) {
                  target.remove();
                }
              } else {
                target.removeClass('on');
                target.html('+  关注')
                ApiBridge.callNative('ClientViewManager', 'showToastView', {
                  type: 1,
                  msg: '取消关注成功'
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
            if ((!!info.icon1) || (/author/.test(window.location.href))) {
              var icon1 = {
                icon1: !type ? 'articleplatform_icon_correct' : 'articleplatform_icon_add',
                icon1_p: !type ? 'articleplatform_icon_correct_p' : 'articleplatform_icon_add_p',
              };

              vm.setRightIcon(icon1);

              //target = !!$('.c-att-href').length ? $('.c-att-href') : $('.c-auth-follow');
            }

            if (!type) {
              target.addClass('on');
              target.html('已关注')
              ApiBridge.callNative('ClientViewManager', 'showToastView', {
                  type: 1,
                  msg: '关注成功'
                })
                //判断流
              if (/tag-name/.test(window.location.href)) {
                target.remove();
              }
            } else {
              target.removeClass('on');
              target.html('+  关注')
              ApiBridge.callNative('ClientViewManager', 'showToastView', {
                type: 1,
                msg: '取消关注成功'
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
    var params = !options.isJson ? formatParams(options.data) : options.data;
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

      var dragThreshold = opt.dragThreshold || 0.3; // 临界值

      var moveCount = opt.moveCount || 400; // 位移系数

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

        pullText.text('下拉刷新');
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

  //图片比例
  resizeImg: function(img) {
    $(this).height($(img).width() * 0.5625);
  }
};

//本地数据页码
vm.data.localNextIndex = 0;

//滚动默认为true;
vm.data.isLoad = true;

//tab切换
vm.tab('.js-td', '.js-tb');
ApiBridge.callNative('ClientViewManager', 'hideLoadingView');
