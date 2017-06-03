//标签列表页
//
vm.data.scrollTopArr = [];
vm.initTag = function() {
  //本地储存scroll

  vm.data.tagListTop = window.pageYOffset || document.body.scrollTop;
  //to do 本地存储点赞
  vm.data.likes = [];
  // mock

  // vm.tagList(vm.data.tagListIndex);
  // mock
  ApiBridge.callNative('ClientViewManager', 'setTitleLabelCallback', {}, function(index) {


    $('.c-empty').hide()


    if (vm.data.tagListIndex !== 3 || vm.data.tagListIndex !== 0) {
      ApiBridge.callNative('ClientVideoManager', 'deleteById', {
        mediaid: vm.data.mediaid,
      });
    }
    if (vm.data.tagListIndex !== 4 || vm.data.tagListIndex !== 0) {

      ApiBridge.callNative('ClientAudioManager', 'deleteById', {
        mediaid: vm.data.mediaid,
      });
    }

    //记录scrollTop
    // if(!vm.data.scrollTopArr[vm.data.tagListIndex]){
    //   document.body.scrollTop = 0;
    // }
    // else{
    //   document.body.scrollTop = vm.data.scrollTopArr[Number(index.index)]
    // }
    // vm.data.scrollTopArr[vm.data.tagListIndex] = document.body.scrollTop;

    vm.data.tagListIndex = Number(index.index);


    $('.js-tag-list-ul ul').eq(vm.data.tagListIndex).show().siblings().hide();

    //判断是否请求过内容
    if ($('.js-tag-list-ul ul').eq(vm.data.tagListIndex).html() == '') {
      vm.tagList(vm.data.tagListIndex, 'set', 1);
    }

    vm.upScroll(function() {
      if (!!vm.data.isLoad) {
        vm.data.isLoad = false;
        $('.c-loading').show();

        if (vm.data.tagListIndex == 3 || vm.data.tagListIndex == 0) {
          ApiBridge.callNative('ClientVideoManager', 'deleteById', {
            mediaid: vm.data.mediaid,
          });
        }
        if (vm.data.tagListIndex == 4 || vm.data.tagListIndex == 0) {

          ApiBridge.callNative('ClientAudioManager', 'deleteById', {
            mediaid: vm.data.mediaid,
          });
        }
        if (vm.data.isloadmore) {
          // $('.c-loading').show();
          vm.tagList(vm.data.tagListIndex, 'up');
        }else{
          $('.c-loading').hide()
        }
      }
    });

  })

  //上拉翻页加载
  // vm.upScroll(function() {
  //   if (!!vm.data.isLoad) {
  //     vm.data.isLoad = false;
  //     // $('.c-loading').show();

  //     if (vm.data.tagListIndex == 3) {
  //       ApiBridge.callNative('ClientVideoManager', 'deleteById', {
  //         mediaid: vm.data.mediaid,
  //       });
  //     }
  //     if (vm.data.tagListIndex == 4) {

  //       ApiBridge.callNative('ClientAudioManager', 'deleteById', {
  //         mediaid: vm.data.mediaid,
  //       });

  //       var audioEl = $('.js-tag-list').find('.c-tag-audio');

  //       if (audioEl.length) {
  //         audioEl.map(function(index, item) {
  //           $(item).removeClass('c-tag-audio');
  //         })
  //       }
  //     }
  //     if (vm.data.isloadmore) {
  //       $('.c-loading').show();
  //       vm.tagList(vm.data.tagListIndex, 'up');
  //     }
  //   }
  // });

  //监听销毁视频
  vm.deleteMediaWatch();

  //默认请求数据
  //vm.tagList();

  //下拉刷新
  vm.reFresh.init({
    container: '.container',
    beforePull: function() {
      console.log('beforePull')

      if (vm.data.tagListIndex == 3 || vm.data.tagListIndex == 0) {
        ApiBridge.callNative('ClientVideoManager', 'deleteById', {
          mediaid: vm.data.mediaid,
        });
      }
      if (vm.data.tagListIndex == 4 || vm.data.tagListIndex == 0) {

        ApiBridge.callNative('ClientAudioManager', 'deleteById', {
          mediaid: vm.data.mediaid,
        });
      }
    },
    onRefresh: function() {
      if (!vm.data.isRender) {
        return;
      }
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

//标签列表
vm.tagList = function(index, flag, num) {
  // mock
  // var res = {
  // "message": "",
  // "result": {
  //  "isloadmore": true,
  //  "lastid": "2017-05-15 15:34:18740|101018",
  //  "newslist": [{
  //    "content": "",
  //    "description": "",
  //    "identifiertype": "",
  //    "imageheight": 0,
  //    "imagewidth": 0,
  //    "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g14/M15/A2/5D/autohomecar__wKjByVkaav6AODgqAAJh9Is28Mg542.png?imageView2/2/w/640"],
  //    "isattention": 0,
  //    "iscandelete": 0,
  //    "mediaid": "333",
  //    "mediatype": 1,
  //    "newsid": 101175,
  //    "pics": [],
  //    "playtime": "",
  //    "praisenum": 0,
  //    "publishtime": "2017-05-16",
  //    "pv": 159,
  //    "replycount": "4",
  //    "seriesids": "",
  //    "session_id": "f86b69c046d34ebca5ccb9e19918b4ea",
  //    "status": 0,
  //    "statusNote": "",
  //    "statusStr": "",
  //    "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g14/M15/A2/5D/autohomecar__wKjByVkaav6AODgqAAJh9Is28Mg542.png?imageView2/1/w/400/h/225"],
  //    "title": "保时捷Macan漏油隐患波及奥迪，24万台Q5、Q7将被召回",
  //    "userid": 39356249,
  //    "username": "汽车评中评",
  //    "userpic": "https://qnwww2.autoimg.cn/youchuang/g9/M11/54/73/autohomecar__wKjBzljsQ52AWTKgAADEllW0O8w133.jpg?imageView2/1/w/120/h/120"

  //  }, {
  //    "content": "",
  //    "description": "",
  //    "identifiertype": "",
  //    "imageheight": 0,
  //    "imagewidth": 0,
  //    "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g22/M04/C9/3B/autohomecar__wKjBwVkZWRCARNAVAAyajoqWYLY268.jpg?imageView2/2/w/640", "https://qnwww2.autoimg.cn/youchuang/g22/M04/C9/3B/autohomecar__wKjBwVkZWRCARNAVAAyajoqWYLY268.jpg?imageView2/2/w/640", "https://qnwww2.autoimg.cn/youchuang/g22/M04/C9/3B/autohomecar__wKjBwVkZWRCARNAVAAyajoqWYLY268.jpg?imageView2/2/w/640", "https://qnwww2.autoimg.cn/youchuang/g22/M04/C9/3B/autohomecar__wKjBwVkZWRCARNAVAAyajoqWYLY268.jpg?imageView2/2/w/640"],
  //    "isattention": 0,
  //    "iscandelete": 0,
  //    "mediaid": "333333222",
  //    "mediatype": 2,
  //    "newsid": 101028,
  //    "pics": [],
  //    "playtime": "",
  //    "praisenum": 2,
  //    "publishtime": "2017-05-15",
  //    "pv": 307,
  //    "replycount": "1",
  //    "seriesids": "",
  //    "session_id": "f080eebbe59346058975b99e2616c2bd",
  //    "status": 0,
  //    "statusNote": "",
  //    "statusStr": "",
  //    "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g15/M02/A2/CA/autohomecar__wKgH5VkZXliAPDKJAAhveSbp5ok870.jpg?imageView2/1/w/400/h/225"],
  //    "title": "原来你是这样的汉子 体验长安CS95智趣格调",
  //    "userid": 38586638,
  //    "username": "跟我视驾",
  //    "userpic": "https://qnwww2.autoimg.cn/youchuang/g11/M13/2E/05/autohomecar__wKgH0ljHiTeAVBnvAAAwrCgJLxI146.jpg?imageView2/1/w/120/h/120"

  //  }, {
  //    "content": "",
  //    "description": "",
  //    "identifiertype": "",
  //    "imageheight": 0,
  //    "imagewidth": 0,
  //    "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g22/M04/C9/3B/autohomecar__wKjBwVkZWRCARNAVAAyajoqWYLY268.jpg?imageView2/2/w/640"],
  //    "isattention": 0,
  //    "iscandelete": 0,
  //    "mediaid": "83943242",
  //    "mediatype": 3,
  //    "newsid": 101018,
  //    "pics": [],
  //    "playtime": "",
  //    "praisenum": 0,
  //    "publishtime": "2017-05-15",
  //    "pv": 382,
  //    "replycount": "0",
  //    "seriesids": "",
  //    "session_id": "e935c82d33b54a4dbe6e8d0fba8ef70e",
  //    "status": 0,
  //    "statusNote": "",
  //    "statusStr": "",
  //    "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g22/M04/C9/3B/autohomecar__wKjBwVkZWRCARNAVAAyajoqWYLY268.jpg?imageView2/1/w/400/h/225"],
  //    "title": "融入智能科技的旗舰SUV 长安CS95推出高配专属车型",
  //    "userid": 25414521,
  //    "username": "车算子",
  //    "userpic": "https://qnwww2.autoimg.cn/youchuang/g18/M04/95/39/autohomecar__wKgH2VkScwKAM-DeAAQUdGTj1ss505.jpg?imageView2/1/w/120/h/120"

  //  }, {
  //    "content": "",
  //    "description": "",
  //    "identifiertype": "",
  //    "imageheight": 0,
  //    "imagewidth": 0,
  //    "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g22/M04/C9/3B/autohomecar__wKjBwVkZWRCARNAVAAyajoqWYLY268.jpg?imageView2/2/w/640"],
  //    "isattention": 0,
  //    "iscandelete": 0,
  //    "mediaid": "343243242",
  //    "mediatype": 4,
  //    "newsid": 101018,
  //    "pics": [],
  //    "playtime": "",
  //    "praisenum": 0,
  //    "publishtime": "2017-05-15",
  //    "pv": 382,
  //    "replycount": "0",
  //    "seriesids": "",
  //    "session_id": "e935c82d33b54a4dbe6e8d0fba8ef70e",
  //    "status": 0,
  //    "statusNote": "",
  //    "statusStr": "",
  //    "thumbnailpics": ["https://qnwww2.autoimg.cn/youchuang/g22/M04/C9/3B/autohomecar__wKjBwVkZWRCARNAVAAyajoqWYLY268.jpg?imageView2/1/w/400/h/225"],
  //    "title": "融入智能科技的旗舰SUV 长安CS95推出高配专属车型",
  //    "userid": 25414521,
  //    "username": "车算子",
  //    "userpic": "https://qnwww2.autoimg.cn/youchuang/g18/M04/95/39/autohomecar__wKgH2VkScwKAM-DeAAQUdGTj1ss505.jpg?imageView2/1/w/120/h/120"

  //  }]

  // },
  // "returncode": 0

  // }
  // vm.renderTagList(res.result.newslist, index);
  // return;

  //mock
  var lastpageid = vm.data.lastpageid || '';
  var pid = '';

  if (flag == 'up') {
    pid = lastpageid;
  }
  $('.c-loading').show();
  ApiBridge.log(vm.data.isLoad)
  ApiBridge.log('vm.data.isLoad tag name')

  ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {

    //未登录 
    vm.ajax({
      url: vm.data.url + '/npnewlistfortagid.json',
      type: "GET",
      data: {
        pm: vm.mobileType() == 'iOS' ? 1 : 2,
        tagid: vm.getParam('tagid'),
        pid: pid,
        au: user.userAuth || '',
        pagesize: 20,
        otype: 0,
        itype: index || 0
      },
      dataType: "json",
      success: function(res, xml) {
        ApiBridge.log('vm.data.isLoad tag name succ')
        ApiBridge.callNative('ClientViewManager', 'hideLoadingView');

        res = JSON.parse(res);
        vm.data.isloadmore = res.result.isloadmore || '';

        vm.data.lastpageid = res.result.lastid || '';

        if (!!res.result.newslist.length) {
          vm.renderTagList(res.result.newslist, index, num);
        } else {
          $('.c-loading').hide();
          $('.c-empty').show();
        }
      },
      fail: function(status) {
        ApiBridge.log('vm.data.isLoad tag name fail')
        $('.c-loading').hide();
        ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
          ApiBridge.callNative('ClientViewManager', 'showLoadingView');
          vm.initTag();
        })
      }
    });
  });
}

//渲染标签详情列表
vm.renderTagList = function(data, index, num) {
  vm.data.isRender = false;
  index = index || 0;
  if (!!data.length) {
    // mock
    // var html = '';

    // data.map(function(v) {
    //  //判断赞
    //  if (vm.getLs('tagLiked') && vm.getLs('tagLiked').length) {
    //    vm.getLs('tagLiked').map(function(j) {
    //      if (j == v['userid']) {
    //        v['zaned'] = 1;
    //      } else {
    //        v['zaned'] = 0;
    //      }
    //    })
    //  }
    //  if (v['mediatype'] == 4) {
    //    html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userid=' + v['userid'] + ' class=media-audio>' + '<a class="c-att-t" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '>' + (v['isattention'] == 1 ? '已关注' : '+ 关注') + '</a>' + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<div class="c-media-audio">' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + '<img class="c-auth-info-img" src=' + v['thumbnailpics'] + ' alt=""></div><span class="c-tab-jj ">' + ((v['mediatype'] == 1 || v['mediatype'] == 4 || v['mediatype'] == 3) ? v['title'] : v['description']) + '</span></div>' + '<p class="span c-tab-ue">' + '<span class="c-zan" newsid=' + v['newsid'] + '><span class="zan-icon ' + (v['zaned'] == 1 ? 'on-no-inmation' : '') + '"></span><span class="c-num">' + (v['praisenum'] || 0) + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + (v['replycount'] || 0) + '</span></span>' + '</p>' + '<span class="c-looked">' + v['pv'] + ' 浏览</span>' + '</li>';
    //  } else if (v['mediatype'] == 2) {

    //    var qingImg = '<div class="c-qing-img-wp" newsid=' + v['newsid'] + ' picurl=' + v['thumbnailpics'] + ' sharecontent=' + v['description'] + '>';
    //    v['thumbnailpics'].map(function(k, i) {
    //      if (i > 2) {
    //        return;
    //      }
    //      qingImg += '<img class="c-qing-img" imgnum=' + v['thumbnailpics'].length + ' src=' + k + ' />'
    //    })
    //    if (v['thumbnailpics'].length > 3) {
    //      qingImg += '<span class="c-qing-num">' + v['thumbnailpics'].length + '</span></div>'
    //    }
    //    html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userid=' + v['userid'] + ' class=media-qing>' + '<a class="c-att-t ' + (v['isattention'] == '1' ? 'on' : '') + '" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '>' + (v['isattention'] ? '已关注' : '+ 关注') + '</a>' + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<div class="c-media-audio">' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + '</div><span class="c-tab-jj ">' + ((v['mediatype'] == 3 || v['mediatype'] == 4 || v['mediatype'] == 1) ? v['title'] : v['description']) + '</span>' + qingImg + '</div>' + '<p class="span c-tab-ue">' + '<span class="c-zan" newsid=' + v['newsid'] + '><span class="zan-icon  ' + (v['zaned'] == 1 ? 'on-no-inmation' : '') + '"></span><span class="c-num">' + (v['praisenum'] || 0) + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + (v['replycount'] || 0) + '</span></span>' + '</p>' + '<span class="c-looked">' + v['pv'] + ' 浏览</span>' + '</li>';
    //  } else {

    //    html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userid=' + v['userid'] + ' >' + '<a class="c-att-t" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + ' >' + (v['isattention'] == 1 ? '已关注' : '+ 关注') + '</a>' + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<p class="c-tab-jj ' + (v['mediatype'] == 1 ? 'short' : 'long') + '">' + ((v['mediatype'] == 1 || v['mediatype'] == 4 || v['mediatype'] == 3) ? v['title'] : v['description']) + '</p>' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + '<img class="c-auth-info-img" src=' + v['thumbnailpics'] + ' alt=""></div>' + '<p class="span c-tab-ue">' + '<span class="c-zan" newsid=' + v['newsid'] + '><span class="zan-icon  ' + (v['zaned'] == 1 ? 'on-no-inmation' : '') + '"></span><span class="c-num">' + (v['praisenum'] || 0) + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + (v['replycount'] || 0) + '</span></span>' + '</p>' + '<span class="c-looked">' + v['pv'] + ' 浏览</span>' + '</li>';
    //  }
    // })

    // if (!vm.data.isLoad) {
    //  $('.c-tab-bd ul').eq(index).append(html);
    // } else {
    //  $('.c-tab-bd ul').eq(index).html(html);
    // }

    // $('.c-loading').hide();
    // vm.data.isLoad = true;

    // $('.c-tab-bd ul').eq(index).children('li').each(function(v, i) {
    //    if ($(i).attr('mediatype') == 4) {
    //      return
    //    };
    //    $(i).find('.c-auth-info-img').height($(i).find('.c-auth-info-img').width() * 0.5625);
    //    if ($(i).attr('mediatype') == 2) {
    //      //$(i).find('.c-qing-img').height($(i).find('.c-qing-img').width() * 0.6);
    //    }
    //  })
    //  // debugger
    //  // var audio = $('.js-tag-list').find('.c-tag-video').addClass('c-tag-audio');
    // return;
    // mock

    //本地关注与线上数据判断已关注过滤
    //登录未登录 

    ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
      var html = '';

      //未登录 
      if (!Number(user.userId)) {
        try {

          //判断赞
          ApiBridge.log(vm.data.likes)
          if (vm.data.likes.length) {
            vm.data.likes.map(function(j) {
              if (j == v['userid']) {
                v['zaned'] = 1;
              } else {
                v['zaned'] = 0;
              }
            })
          }

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
                html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userid=' + v['userid'] + ' class=media-audio>' + (v['isattention'] == 1 ? '' : '<a class="c-att-t ' + '" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '>+ 关注</a>') + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<div class="c-media-audio">' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + (v['thumbnailpics'].length > 0 ? '<img class="c-auth-info-img c-auth-audio-img" src=' + v['thumbnailpics'][0] + ' alt="">' : '') + '</div><span class="c-tab-jj ">' + ((v['mediatype'] == 1 || v['mediatype'] == 4 || v['mediatype'] == 3) ? v['title'] : v['description']) + '</span></div>' + '<p class="span c-tab-ue">' + '<span class="c-zan" newsid=' + v['newsid'] + '><span class="zan-icon ' + (v['zaned'] == 1 ? 'on-no-inmation' : '') + '"></span><span class="c-num">' + (v['praisenum']) + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + (v['replycount']) + '</span></span>' + '</p>' + '<span class="c-looked">' + (v['pv'] || 0) + '播放</span><span class="c-media-time">' + v['playtime'] + '</span>' + '</li>';
              } else if (v['mediatype'] == 2) {

                var qingImg = '<div class="c-qing-img-wp" newsid=' + v['newsid'] + ' picurl=' + v['indexdetail'] + ' sharecontent=' + v['description'] + '>';
                if (v['thumbnailpics'].length < 3 && v['thumbnailpics'].length > 0) {
                  vm.data.oneQingWid = true;
                  qingImg = '<div class="c-qing-img-one"><img class="c-qing-img" imgnum=' + v['thumbnailpics'].length + ' src=' + v['thumbnailpics'][0] + ' /></div>'
                } else {
                  v['thumbnailpics'].map(function(k, i) {
                    if (i > 2) {
                      return;
                    }
                    qingImg += '<img class="c-qing-img" imgnum=' + v['thumbnailpics'].length + ' src=' + k + ' />'
                  })
                }

                if (v['thumbnailpics'].length > 3) {
                  qingImg += '<span class="c-qing-num">' + v['thumbnailpics'].length + '</span>'
                } else {
                  qingImg += '</div>'
                }
                html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userid=' + v['userid'] + ' class=media-qing>' + (v['isattention'] == 1 ? '' : '<a class="c-att-t" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '>+ 关注</a>') + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<div class="c-media-audio">' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + '</div><span class="c-tab-jj ">' + ((v['mediatype'] == 3 || v['mediatype'] == 4 || v['mediatype'] == 1) ? v['title'] : v['description']) + '</span>' + qingImg + '</div>' + '<p class="span c-tab-ue">' + '<span class="c-zan" newsid=' + v['newsid'] + '><span class="zan-icon ' + (v['zaned'] == 1 ? 'on-no-inmation' : '') + '"></span><span class="c-num">' + (v['praisenum']) + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + (v['replycount']) + '</span></span>' + '</p>' + '<span class="c-looked">' + (v['pv'] || 0) + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '播放' : '浏览') + '</span>' + '</li>';
              } else {

                html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userid=' + v['userid'] + ' >' + (v['isattention'] == 1 ? '' : '<a class="c-att-t ' + '" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '>+ 关注</a>') + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<p class="c-tab-jj ' + (v['mediatype'] == 1 ? 'short' : 'long') + '">' + ((v['mediatype'] == 1 || v['mediatype'] == 4 || v['mediatype'] == 3) ? v['title'] : v['description']) + '</p>' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + (v['thumbnailpics'].length > 0 ? '<img class="c-auth-info-img" src=' + v['thumbnailpics'][0] + ' alt="">' : '') + '<span class="c-media-time">' + v['playtime'] + '</span></div>' + '<p class="span c-tab-ue">' + '<span class="c-zan" newsid=' + v['newsid'] + '><span class="zan-icon ' + (v['zaned'] == 1 ? 'on-no-inmation' : '') + '"></span><span class="c-num">' + (v['praisenum']) + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + (v['replycount']) + '</span></span>' + '</p>' + '<span class="c-looked">' + (v['pv'] || 0) + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '播放' : '浏览') + '</span>' + '</li>';
              }
            })

            vm.data.isRender = true;
            if (!vm.data.isLoad) {
              $('.c-tab-bd ul').eq(index).append(html);
            } else {
              $('.c-tab-bd ul').eq(index).html(html);
            }
            
            $('.c-tab-bd ul').eq(index).children('li').each(function(v, i) {
              if ($(i).attr('mediatype') == 4) {
                return
              };

              if(!vm.data.tagImgwidth){
                vm.data.tagImgwidth = $(i).find('.c-auth-info-img').width();
              }

              $(i).find('.c-auth-info-img').height(vm.data.tagImgwidth * 0.5625);

              if ($(i).attr('mediatype') == 2) {
                $(i).find('.c-qing-img').height($(i).find('.c-qing-img').width() * 0.5625);
              }
            })
            $('.c-loading').hide();
            vm.data.isLoad = true;
          })
        } catch (e) {}
      } else {
        if (vm.data.likes.length) {
          vm.data.likes.map(function(j) {
            if (j == v['userid']) {
              v['zaned'] = 1;
            } else {
              v['zaned'] = 0;
            }
          })
        }
        data.map(function(v) {

          if (v['mediatype'] == 4) {
            //if (v[''])
            // var isErrorTip = 
            html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userid=' + v['userid'] + ' class=media-audio>' + (v['isattention'] == 1 ? '' : '<a class="c-att-t ' + '" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '>+ 关注</a>') + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<div class="c-media-audio">' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + (v['thumbnailpics'].length > 0 ? '<img class="c-auth-info-img" src=' + v['thumbnailpics'][0] + ' alt="">' : '') + '</div><span class="c-tab-jj ">' + ((v['mediatype'] == 1 || v['mediatype'] == 4 || v['mediatype'] == 3) ? v['title'] : v['description']) + '</span></div>' + '<p class="span c-tab-ue">' + '<span class="c-zan" newsid=' + v['newsid'] + '><span class="zan-icon ' + (v['zaned'] == 1 ? 'on-no-inmation' : '') + '"></span><span class="c-num">' + (v['praisenum']) + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + (v['replycount']) + '</span></span>' + '</p>' + '<span class="c-looked">' + (v['pv'] || 0) + '播放</span><span class="c-media-time">' + v['playtime'] + '</span>' + '</li>';
          } else if (v['mediatype'] == 2) {

            var qingImg = '<div class="c-qing-img-wp"  newsid=' + v['newsid'] + ' picurl=' + v['indexdetail'] + ' sharecontent=' + v['description'] + '>';

            if (v['thumbnailpics'].length < 3 && !!v['thumbnailpics'].length) {
              vm.data.oneQingWid = true;
              qingImg = '<div class="c-qing-img-one"><img class="c-qing-img" imgnum=' + v['thumbnailpics'].length + ' src=' + v['thumbnailpics'][0] + ' /></div>'
            } else {
              v['thumbnailpics'].map(function(k, i) {
                if (i > 2) {
                  return;
                }
                qingImg += '<img class="c-qing-img" imgnum=' + v['thumbnailpics'].length + ' src=' + k + ' />'
              })
            }
            if (v['thumbnailpics'].length > 3) {
              qingImg += '<span class="c-qing-num">' + v['thumbnailpics'].length + '</span></div>'
            } else {
              qingImg += '</div>'
            }
            html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userid=' + v['userid'] + ' class=media-qing>' + (v['isattention'] == 1 ? '' : '<a class="c-att-t ' + '" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '>+ 关注</a>') + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<div class="c-media-audio">' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + '</div><span class="c-tab-jj ">' + ((v['mediatype'] == 3 || v['mediatype'] == 4 || v['mediatype'] == 1) ? v['title'] : v['description']) + '</span>' + qingImg + '</div>' + '<p class="span c-tab-ue">' + '<span class="c-zan" newsid=' + v['newsid'] + '><span class="zan-icon ' + (v['zaned'] == 1 ? 'on-no-inmation' : '') + '"></span><span class="c-num">' + (v['praisenum']) + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + (v['replycount']) + '</span></span>' + '</p>' + '<span class="c-looked">' + (v['pv'] || 0) + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '播放' : '浏览') + '</span>' + '</li>';
          } else {

            html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userid=' + v['userid'] + ' >' + (v['isattention'] ? '' : '<a class="c-att-t ' + '" userid=' + v['userid'] + ' username=' + v['username'] + ' userpic=' + v['userpic'] + ' usertime=' + (v['publishtime'] || '') + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '>+ 关注</a>') + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + v['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + v['username'] + '</p></div>' + '<p class="c-tab-jj ' + (v['mediatype'] == 1 ? 'short' : 'long') + '">' + ((v['mediatype'] == 1 || v['mediatype'] == 4 || v['mediatype'] == 3) ? v['title'] : v['description']) + '</p>' + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + (v['thumbnailpics'].length > 0 ? '<img class="c-auth-info-img" src=' + v['thumbnailpics'][0] + ' alt="">' : '') + '<span class="c-media-time">' + v['playtime'] + '</span></div>' + '<p class="span c-tab-ue">' + '<span class="c-zan" newsid=' + v['newsid'] + '><span class="zan-icon ' + (v['zaned'] == 1 ? 'on-no-inmation' : '') + '"></span><span class="c-num">' + (v['praisenum']) + '</span></span>' + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + (v['replycount']) + '</span></span>' + '</p>' + '<span class="c-looked">' + (v['pv'] || 0) + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '播放' : '浏览') + '</span>' + '</li>';
            // (vm.data.isAuthor && v['iscandelete'] == 1 ? 
          }
        })
        vm.data.isRender = true;

        if (!vm.data.isLoad) {
          $('.c-tab-bd ul').eq(index).append(html);
        } else {
          $('.c-tab-bd ul').eq(index).html(html);
        }


        $('.c-tab-bd ul').eq(index).children('li').each(function(v, i) {
          if ($(i).attr('mediatype') == 4) {
            return
          };
          
          if(!vm.data.tagImgwidth){
            vm.data.tagImgwidth = $(i).find('.c-auth-info-img').width();
          }

          $(i).find('.c-auth-info-img').height(vm.data.tagImgwidth * 0.5625);
             
          if ($(i).attr('mediatype') == 2) {
            $(i).find('.c-qing-img').height($(i).find('.c-qing-img').width() * 0.5625);
          }
        })

        $('.c-loading').hide();
        vm.data.isLoad = true;
      }
    })
  }
}

//标签列表
if (/tag-name/.test(window.location.href)) {
  //mock

  // vm.initTag()
  //mock
  vm.data.isLoad = true;
  ApiBridge.callNative("ClientDataManager", "getNetworkState", {}, function(state) {
    vm.data.isNet = state.result;
    //未联网
    if (!Number(vm.data.isNet)) {
      ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
        ApiBridge.callNative('ClientViewManager', 'showLoadingView')
        vm.initTag();
      })
    } else {
      vm.initTag();
    }
  })
}
