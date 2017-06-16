'use strict';

vm.chejiahaoPv = function(data){
  var pvMap = {
    "eventid": data.eventid,
    "pagename": data.pagename,
    "isdata": data.isdata,
    "reportjson": {
        "userid1#1": vm.data.userId,
        "userid2#2": vm.getParam('userId')
    }
  };

  ApiBridge.callNative('ClientPvManager', 'pagePv', pvMap)
}
 
//点击删除某条信息
vm.data.isloadmore = [];
vm.deleteNewModal = function(e) {
  e.stopPropagation();
  // mock
  // vm.deleteNew(e);
  // mock
  ApiBridge.callNative('ClientViewManager', 'showDrawerView', {
    names:["删除"]
  }, function(result){
    if(result.result == 0){
      vm.deleteNew(e);
    }
  })
}

//点击删除某条信息
vm.deleteNew = function(e) {
  e.stopPropagation();
  var $target = $(e.target);
  var $parent = $target.parent();
  var newsid = $target.attr('newsid');

  ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
    vm.ajax({
      url: 'https://chejiahaoopen.api.autohome.com.cn/OpenInfoService.svc/DeleteForUserSelf',
      type: "POST",
      isJson: true,
      data: {
        _appid: vm.mobileType() == 'iOS' ? 'app' : 'app_android',
        pcpopclub: user.userAuth,
        // autohomeua: user.userAgent,
        infoId: newsid
      },
      dataType: "json",
      success: function(res, xml) {
        res = JSON.parse(res);
        if (res.result == 1) {
          if (vm.data.mediatype == 3) {
            ApiBridge.callNative('ClientVideoManager', 'deleteById', {
              mediaid: vm.data.mediaid,
            });
          }
          vm.getAuthorPage(vm.data.tagListIndex);

          $('.c-tab-bd ul').each(function(index, par) {
            $(par).children('li').each(function(v, i) {
              if ($(i).attr('newsid') == $parent.attr('newsid')) {
                $(i).remove();
              };
            })
            ApiBridge.log($(par).html());

            if((index == 0 || index == vm.data.tagListIndex) && $(par).html() == ''){
              // $(par).html('');
              $('.c-tab-empty').height(vm.data.emptyHeight);
              $('.c-tab-empty').show();
            }
          })
        }
      },
      fail: function(status) {}
    });
  })
}

vm.setRightIcon = function (icon, flag){
  var shareinfo = vm.data.authInfo.shareinfo;
  
  if(vm.data.userId != vm.getParam('userId')){

    var $scrollTop = document.body.scrollTop;
    var $titleHeight = $('.c-auth-title').height();

    var $offsetTop = $('.c-auth-title').offset().top;
    
    if(flag !== 'icon2' && $scrollTop < ($offsetTop + $titleHeight)){
      icon = {
        icon1: '',
        icon1_p: ''
      }
    }

    ApiBridge.callNative('ClientNavigationManager', 'setRightIcon', {
      righticons: icon
    }, function(result) {
      if(result.result == 'icon2'){

        var opt = {
          share: {
            url: shareinfo.shareurl ||'',
            title: shareinfo.sharetitle ||'',
            logo: shareinfo.sharelogo ||'',
            icon: shareinfo.shareicon ||' ',
            summary: shareinfo.sharesummary ||''
          },
          pagetype: 5,
          sharepositiontype: 44,
          objectid: vm.getParam('userId')
        };
        
        ApiBridge.callNative('ClientShareManager', 'shareAction', opt);
      }
      else{
        var type = $('.c-auth-follow').hasClass('on') ? 1 : 0;
        var userId = vm.getParam('userId');

        var follow = {
          userid: userId,
          username: vm.data.authInfo.userinfo.name,
          imgurl: vm.data.authInfo.userinfo.userpic,
          icon1: true
        };
        vm.followToggle(userId, type, follow, $('.c-auth-follow'));
      }
    })
  }
}

vm.setNav = function(info, data){
  var shareinfo = data.shareinfo;
  
  ApiBridge.callNative('ClientNavigationManager', 'setNavBackIcon', {
    navigationbacktype: info.navigationbacktype || 5
  })

  ApiBridge.callNative('ClientNavigationManager', 'setNavCircleIcon', {
    imgurl: info.imgurl || ''
  })
  ApiBridge.callNative('ClientNavigationManager', 'setNavTitle', {
    title: info.title || ''
  })

  ApiBridge.callNative('ClientNavigationManager', 'setNavAlpha', {
    alpha: info.alpha || 0
  })

  var statusBarStyle = (info.statusBarStyle == 0) ? 0 : 1;
  ApiBridge.callNative('ClientViewManager', 'setStatusBarStyle', {
    statusBarStyle: statusBarStyle
  })

  if(vm.data.userId != vm.getParam('userId')){
    var icon2 = {
      icon2: info.icon2 || 'articleplatform_icon_share_w',
      icon2_p: info.icon2_p || 'articleplatform_icon_share_w_p'
    };
    vm.setRightIcon(icon2, 'icon2');
  }
}
//高斯模糊设置
vm.setImgWithBlur = function(userinfo){
  var opt = {
    url: vm.data.userinfo.userpic,
    set: {
      radius: vm.mobileType() == 'iOS' ? 10 : 30,
      saturationdeltafactor: vm.mobileType() == 'iOS' ? 1 : 1.8,
      outwidth: '375',
      leftrightmargin: '30'
    }
  };

  ApiBridge.callNative("ClientImageManager", "getImageWithBlur", opt, function(result) {
    var html = '<img class="c-auth-bg" src="data:image/jpeg;base64,' + result.result+'"/>';
    if(result.result){
      $('.c-auth-bg').html(html);
      vm.data.hasUserInfo = true;
    }
  });
}

//渲染作者主页作者信息部分
vm.renderAuthorInfo = function(data, index){
  index = index || 0;
  

  if(!vm.data.hasUserInfo){
    // vm.data.authInfo = $.extend({},data);
    var userinfo = vm.data.authInfo.userinfo;

    vm.data.userinfo = $.extend({}, vm.data.authInfo.userinfo);

    vm.setImgWithBlur(vm.data.userinfo);

    //注册一次
    if(vm.data.isScrollAuthor){
      vm.navWatch(vm.data.authInfo);
    }
    vm.data.isScrollAuthor = false;
    
    //主页展示
    var html = '<div class="c-auth-native"></div>'
        + '<div class="c-auth-bg"></div>'
        + '<div class="c-auth-info">'
        + '<img id="c-auth-img" class="c-auth-img" userId=' + userinfo['userid'] + ' src=' + (userinfo['userpic'] ? userinfo['userpic'] : './image/pic_head.png') + ' onload="vm.setBagImg(this)" />'
        + '<h3 class="c-auth-title">' + userinfo['name'] + '</h3>'
        + '<p class="c-auth-jj">' + userinfo['desc'] + '</p>'
        + '<p class="c-auth-tips">'
        + '<span class="c-auth-fans">' + userinfo['fanscount'] + '粉丝</span>' 
        + '<span class="c-auth-work">' + userinfo['publishcount'] + '作品</span>' 
        + '</p></div>';

    if(!vm.data.isAuthor){
      //客页
      html += '<p class="c-auth-f">'
        + '<a href="javascript:;" class="c-auth-follow ' + (userinfo['isattention'] == 1 ? 'on' : '') + '" userid=' + vm.getParam('userId') + ' objecttypeid=' + (vm.data.isAuthor ? '7' : '8') + ' username=' + userinfo['name'] + ' userpic=' + userinfo['userpic'] + ' userdesc=' + userinfo['desc'] + '>'+ (userinfo['isattention'] == 1 ?'已关注' :'<span>＋</span> 关注') + '</a>'
        + '</p>';
    }

    $('.c-auth-top').html(html);
    vm.data.hasUserInfo = true;
    document.styleSheets[0].addRule('.c-auth-bg::before','background-image: url(' + userinfo['bgimg'] + ')');
  }

  vm.data.emptyHeight = window.innerHeight - $('.c-tab-title').offset().top -$('.c-tab-title').height();
  vm.renderAuthorNews(data, index);
}

//渲染作者主页
vm.renderAuthorPage = function(data, index){
  index = index || 0;

  // mock
  // vm.renderAuthorInfo(data, index);

  // mock
  if (!!data.userinfo) {
    //未登录 
    if (!Number(vm.data.userId)) {
      try {

        ApiBridge.callNative("ClientDataManager", "getLocalDataForFollow", {}, function(follow) {
          //本地数据有
          if (!!follow.result.length) {
            follow.result.map(function(v) {
              if (v['userId'] == vm.getParam('userId')) {
                data['userinfo']['isattention'] = '1';
              }
            })
          }
          vm.renderAuthorInfo(data, index);
        })
      }catch (e) {}
    }
    else{
      vm.renderAuthorInfo(data, index);
    }
  } 
}

//渲染作者主页消息列表
vm.renderAuthorNews = function(data, index){
  index = index || 0;
  
  var userinfo = data.userinfo;
  var html = '';
  
  data = data.newslist;

  if (!!data.length) {
    data.map(function(v, i) {
      v['pv'] = v['pv'] || 0;

      v['title'] = v['title'].replace(/\s/g, '&nbsp');

      if (v['mediatype'] == 4) {
        html += '<li page="author" newsid=' + v['newsid'] + ' position=' + (i + 1) + ' mediaid=' + (v['mediaid'] || '&nbsp') + ' mediatype=' + v['mediatype'] + ' userId=' + v['userid'] + ' class=media-audio>' 
        + (vm.data.isAuthor && v['iscandelete'] == 1 ? '<a class="c-att-delete" newsid=' + v['newsid'] + ' userid=' + userinfo['userid'] + ' username=' + userinfo['name'] + ' userpic=' + v['userpic'] + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '></a>' : '')
        + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + (userinfo['userpic'] ? userinfo['userpic'] : './image/pic_head.png') + ' alt="" onload="vm.setBagImg(this)">' 
        + '<p userId=' + v['userid'] + ' class="c-auth-title">' + userinfo['name'] + '</p></div>' 
        + '<div class="c-media-audio">' 
        + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + (v['mediaid'] || '&nbsp') + (v['session_id'] ? ' session_id=' + v['session_id'] : '') + (v['newsid'] ? ' newsid=' + v['newsid'] : '') + (v['seriesids'] ? ' seriesids=' + v['seriesids'] : '') + ' pagetype=' + (vm.data.isAuthor ? 4 : 5) + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') 
        + (v['thumbnailpics'].length > 0 ? '<img class="c-auth-info-img  c-auth-audio-img" src=' + v['thumbnailpics'][0] + ' alt="">' : '')

        + '</div><span class="c-tab-jj ">' + ((v['mediatype'] == 1 || v['mediatype'] == 4 || v['mediatype'] == 3) ? v['title'] : v['description']) + '</span></div>' 
        + '<p class="span c-tab-ue">' 
        + '<span class="c-zan" newsid=' + v['newsid'] + ' typeid=' + (vm.data.isAuthor ? 4 : 3 ) + '><span class="zan-icon"></span><span class="c-num">' + v['praisenum'] + '</span></span>' 
        + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + v['replycount'] + '</span></span>' + '</p>' 
        + ((v['status'] == 2 || v['status'] == 100 || v['status'] == 101 ) && vm.data.isAuthor ? '<span class="c-error-tip">' + v['statusStr'] + ' </span>' : '<span class="c-looked">' + (v['pv'] || 0) + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '播放' : '浏览') + '</span>') 
        + '<span class="c-media-time">' + v['playtime'] + '</span>'
        + '</li>';
      } else if (v['mediatype'] == 2) {

        var qingImg = '<div class="c-qing-img-wp" newsid=' + v['newsid'] + ' picurl=' + v['pics'] + ' sharecontent=' + v['description'] +  '>';

        if (v['thumbnailpics'].length > 0 && v['thumbnailpics'].length < 3) {
          qingImg = '<div class="c-qing-img-one"><img class="c-qing-img" typeId="author" imgnum=' + v['thumbnailpics'].length + ' src=' + v['thumbnailpics'][0] + ' seriesids=' + (v['seriesids'] || '') +  ' /></div>'
        } else {
          v['thumbnailpics'].map(function(k, i) {
            if (i > 2) {
              return;
            }
            qingImg += '<img class="c-qing-img" typeId="author" imgnum=' + v['thumbnailpics'].length + ' src=' + k + ' seriesids=' + (v['seriesids'] || '') + ' />'
          })
        }
        if (v['thumbnailpics'].length > 3) {
          qingImg += '<span class="c-qing-num">' + v['thumbnailpics'].length + '</span></div>'
        } else {
          qingImg += '</div>'
        }
        html += '<li page="author" newsid=' + v['newsid'] + ' position=' + (i + 1) + ' mediaid=' + (v['mediaid'] || '&nbsp') + ' mediatype=' + v['mediatype'] + ' userId=' + v['userid'] + ' class=media-qing>' 
        + (vm.data.isAuthor && v['iscandelete'] == 1 ? '<a class="c-att-delete" newsid=' + v['newsid'] + ' userid=' + userinfo['userid'] + ' username=' + userinfo['name'] + ' userpic=' + v['userpic'] + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '></a>' : '')
        + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + (userinfo['userpic'] ? userinfo['userpic'] : './image/pic_head.png') + ' alt="" onload="vm.setBagImg(this)">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + userinfo['name'] + '</p></div>' 
        + '<div class="c-media-audio">' 
        + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + (v['mediaid'] || '&nbsp') + (v['session_id'] ? ' session_id=' + v['session_id'] : '') + (v['newsid'] ? ' newsid=' + v['newsid'] : '') + (v['seriesids'] ? ' seriesids=' + v['seriesids'] : '') + ' pagetype=' + (vm.data.isAuthor ? 4 : 5) + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + '</div><span class="c-tab-jj ">' + ((v['mediatype'] == 3 || v['mediatype'] == 4 || v['mediatype'] == 1) ? v['title'] : v['description']) + '</span>' + qingImg + '</div>' 
        + '<p class="span c-tab-ue">' 
        + '<span class="c-zan" newsid=' + v['newsid'] + ' typeid=' + (vm.data.isAuthor ? 4 : 3 ) + '><span class="zan-icon"></span><span class="c-num">' + v['praisenum'] + '</span></span>' 
        + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + v['replycount'] + '</span></span>' + '</p>' 
        + ((v['status'] == 2 || v['status'] == 100 || v['status'] == 101 ) && vm.data.isAuthor ? '<span class="c-error-tip">' + v['statusStr'] + ' </span>' : '<span class="c-looked">' + (v['pv'] || 0) + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '播放' : '浏览') + '</span>') 
         + '</li>';   
      } else {

        html += '<li page="author" newsid=' + v['newsid'] + ' position=' + (i + 1) + ' mediaid=' + (v['mediaid'] || '&nbsp') + ' mediatype=' + v['mediatype'] + ' userId=' + v['userid'] + ' >' 
        + (vm.data.isAuthor && v['iscandelete'] == 1 ? '<a class="c-att-delete" newsid=' + v['newsid'] + ' userid=' + userinfo['userid'] + ' username=' + userinfo['name'] + ' userpic=' + v['userpic'] + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '></a>' : '')
        + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + (userinfo['userpic'] ? userinfo['userpic'] : './image/pic_head.png') + ' alt="" onload="vm.setBagImg(this)">' 
        + '<p userId=' + v['userid'] + ' class="c-auth-title">' + userinfo['name'] + '</p></div>' 
        + '<p class="c-tab-jj ' + (v['mediatype'] == 1 ? 'long' : 'short') + '">' + ((v['mediatype'] == 1 || v['mediatype'] == 4 || v['mediatype'] == 3) ? v['title'] : v['description']) + '</p>' 
        + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + (v['mediaid'] || '&nbsp') + (v['session_id'] ? ' session_id=' + v['session_id'] : '') + (v['newsid'] ? ' newsid=' + v['newsid'] : '') + (v['seriesids'] ? ' seriesids=' + v['seriesids'] : '') + ' pagetype=' + (vm.data.isAuthor ? 4 : 6) + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') 
        + (v['thumbnailpics'].length > 0 ? '<img class="c-auth-info-img" src=' + v['thumbnailpics'][0] + ' alt="">' : '')
        + (v['mediatype'] == 3? '<span class="c-media-time">' + v['playtime'] + '</span>' : '')
        + '</div>' 
        + '<p class="span c-tab-ue">' 
        + '<span class="c-zan" newsid=' + v['newsid'] + ' typeid=' + (vm.data.isAuthor ? 4 : 3 ) + '><span class="zan-icon"></span><span class="c-num">' + v['praisenum'] + '</span></span>' 
        + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + v['replycount'] + '</span></span>' 
        + '</p>' 
        + ((v['status'] == 2 || v['status'] == 100 || v['status'] == 101 ) && vm.data.isAuthor ? '<span class="c-error-tip">' + v['statusStr'] + ' </span>' : '<span class="c-looked">' + (v['pv'] || 0) + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '播放' : '浏览') + '</span>') 
         + '</li>';
      }

      data.map(function(v,i){
        if(v['userpic']){
          $('.c-tab-list li').eq(i).find('img').css('background', 'transparent');
        } 
      })
    })
    
    if (!vm.data.isLoad) {
      $('.c-tab-bd ul').eq(index).append(html);
      vm.data.isLoad = true;
    } else {
      $('.c-tab-bd ul').eq(index).html(html);
    }
    $('.c-tab-bd ul').eq(index).children('li').each(function(v, i) {
      if ($(i).attr('mediatype') == 4) {
        return
      };

      if(!vm.data.authImgWid){
        vm.data.authImgWid = $(i).find('.c-auth-info-img').width();
      }

      $(i).find('.c-auth-info-img').height(vm.data.authImgWid * 0.5625);

      if ($(i).attr('mediatype') == 2) {
        if($(i).find('.c-qing-img').attr('imgnum') < 3){
          ApiBridge.log('imgnum < 3')
          $(i).find('.c-qing-img').height((window.innerWidth - 40) * 0.5625);
          ApiBridge.log($(i).find('.c-qing-img').height())
        } else {
          ApiBridge.log('imgnum > 3')
          $(i).find('.c-qing-img').height((window.innerWidth - 55)/3 * 0.5625);
        }
      }
    })

    $('.c-loading').hide();
  }
  else{
    if(!!vm.data.isLoad){
      $('.c-tab-empty').height(vm.data.emptyHeight);
      $('.c-tab-empty').show();
    }
  }

  ApiBridge.callNative('ClientViewManager', 'hideLoadingView');
}

//获取作者主页  
vm.getAuthorPage = function(index, flag){
  index = index || 0;

  $('.c-tab-empty').hide();
  // mock
  // console.log(index, tagListIndex)
  // var res = {
  //   message: "",
  //   result: {
  //     isloadmore: 1,
  //     lastid: "2017-01-05 15:42:09023|89843",
  //     newslist: [{
  //       "content": "",
  //       "description": "",
  //       "identifiertype": "",
  //       "imageheight": 0,
  //       "imagewidth": 0,
  //       "indexdetail": [],
  //       "isattention": 1,
  //       "iscandelete": 1,
  //       "mediaid": "04D323D5A73A6932",
  //       "mediatype": 4,
  //       "newsid": 195275,
  //       "pics": [],
  //       "playtime": "02:18",
  //       "praisenum": "",
  //       "publishtime": "2017-05-22",
  //       "pv": "4",
  //       "replycount": "",
  //       "seriesids": "",
  //       "session_id": "11",
  //       "status": 0,
  //       "statusNote": "",
  //       "statusStr": "待审核",
  //       "thumbnailpics": [
  //         "https://qnwww2.autoimg.cn/youchuang/g11/M0B/07/98/autohomecar__wKgH0liix22Acy7HAA7qxSaViaI155.jpg?imageView2/1/w/400/h/225"
  //       ],
  //       "title": "大有进步 全新宝马5系IIHS 25%碰撞解析！！！" + index,
  //       "userid": 0,
  //       "username": "",
  //       "userpic": ""
  //     },{
  //       content: "",
  //       description: "",
  //       identifiertype: "",
  //       imageheight: 0,
  //       imagewidth: 0,
  //       indexdetail: [],
  //       isattention: 0,
  //       iscandelete: 0,
  //       mediaid: "",
  //       mediatype: 2,
  //       newsid: 101380,
  //       pics: [
  //         "https://qnwww2.autoimg.cn/youchuang/g12/M09/9F/E9/autohomecar__wKgH01kbPDuAI3xSAAGNMMeSgqk414.jpg?imageView2/2/w/640",
  //         "https://qnwww2.autoimg.cn/youchuang/g12/M0C/A9/7B/autohomecar__wKgH4lkbPFSAActaAAF5vXvNJdU798.jpg?imageView2/2/w/640",
  //         "https://qnwww2.autoimg.cn/youchuang/g12/M09/9F/E9/autohomecar__wKgH01kbPDuAI3xSAAGNMMeSgqk414.jpg?imageView2/2/w/640",
  //         "https://qnwww2.autoimg.cn/youchuang/g12/M0C/A9/7B/autohomecar__wKgH4lkbPFSAActaAAF5vXvNJdU798.jpg?imageView2/2/w/640"
  //       ],
  //       playtime: "",
  //       praisenum: 31,
  //       publishtime: "2017-05-17",
  //       pv: '',
  //       replycount: "23",
  //       seriesids: "ss",
  //       session_id: "81dd865770894ab3bd0b41b1c918c770",
  //       status: 1,
  //       statusNote: "",
  //       statusStr: "正常",
  //       thumbnailpics: [
  //        "https://qnwww2.autoimg.cn/youchuang/g12/M09/9F/E9/autohomecar__wKgH01kbPDuAI3xSAAGNMMeSgqk414.jpg?imageView2/2/w/640",
  //         "https://qnwww2.autoimg.cn/youchuang/g12/M0C/A9/7B/autohomecar__wKgH4lkbPFSAActaAAF5vXvNJdU798.jpg?imageView2/2/w/640",
  //         "https://qnwww2.autoimg.cn/youchuang/g12/M09/9F/E9/autohomecar__wKgH01kbPDuAI3xSAAGNMMeSgqk414.jpg?imageView2/2/w/640",
  //         "https://qnwww2.autoimg.cn/youchuang/g12/M0C/A9/7B/autohomecar__wKgH4lkbPFSAActaAAF5vXvNJdU798.jpg?imageView2/2/w/640"
  //                 ],
  //       title: "大有进步 全新宝马5系IIHS 25%碰撞解",
  //       description: "大有进步 全新宝马5系IIHS 25%碰撞解",
  //       userid: 0,
  //       username: "",
  //       userpic: ""
  //     },{
  //       content: "",
  //       description: "",
  //       identifiertype: "",
  //       imageheight: 0,
  //       imagewidth: 0,
  //       indexdetail: [],
  //       isattention: 0,
  //       iscandelete: 0,
  //       mediaid: "8D3C26C16C397BD8",
  //       mediatype: 2,
  //       newsid: 91996,
  //       pics: [
          
  //       ],
  //       playtime: "05:35",
  //       praisenum: 1140,
  //       publishtime: "2017-02-14",
  //       pv: 0,
  //       replycount: "459",
  //       seriesids: "",
  //       session_id: "95c3ac2b44294fc1939f9e43a8173651",
  //       status: 1,
  //       statusNote: "",
  //       statusStr: "正常",
  //       thumbnailpics: [
  //         "https://qnwww2.autoimg.cn/youchuang/g11/M0B/07/98/autohomecar__wKgH0liix22Acy7HAA7qxSaViaI155.jpg?imageView2/1/w/400/h/225"
  //       ],
  //       title: "请放开那个座椅加热！曾经加价9万的2014款路虎揽胜运动",
  //       userid: 0,
  //       username: "",
  //       userpic: ""
  //     }, {
  //       content: "",
  //       description: "",
  //       identifiertype: "",
  //       imageheight: 0,
  //       imagewidth: 0,
  //       indexdetail: [],
  //       isattention: 0,
  //       iscandelete: 0,
  //       mediaid: "E071119BD7F5DB1D",
  //       mediatype: 3,
  //       newsid: 91629,
  //       pics: [
  //         "https://qnwww2.autoimg.cn/newsdfs/g14/M13/02/F1/autohomecar__wKgH5FibDYOAYlqtAAFoxOZNEZs882.jpg?imageView2/2/w/640"
  //       ],
  //       playtime: "04:14",
  //       praisenum: 1016,
  //       publishtime: "2017-02-08",
  //       pv: 0,
  //       replycount: "479",
  //       seriesids: "3845",
  //       session_id: "ff988206578f46c387412282dfe11ee1",
  //       status: 1,
  //       statusNote: "编辑待审核",
  //       statusStr: "正常",
  //       thumbnailpics: [
  //         "https://qnwww2.autoimg.cn/newsdfs/g14/M13/02/F1/autohomecar__wKgH5FibDYOAYlqtAAFoxOZNEZs882.jpg?imageView2/1/w/400/h/225"
  //       ],
  //       title: "听说这是个看脸讲情怀的世界？唠唠国产指南者1.4T",
  //       userid: 0,
  //       username: "",
  //       userpic: ""
  //     }, {
  //       content: "",
  //       description: "",
  //       identifiertype: "",
  //       imageheight: 0,
  //       imagewidth: 0,
  //       indexdetail: [],
  //       isattention: 0,
  //       iscandelete: 0,
  //       mediaid: "6BADDEEFC8FE6F43",
  //       mediatype: 3,
  //       newsid: 90675,
  //       pics: [
  //         "https://qnwww2.autoimg.cn/youchuang/g12/M12/F3/82/autohomecar__wKjBy1h_VACABUh9AAw6Ln_Kdeg162.jpg?imageView2/2/w/640"
  //       ],
  //       playtime: "03:54",
  //       praisenum: 1552,
  //       publishtime: "2017-01-18",
  //       pv: 0,
  //       replycount: "563",
  //       seriesids: "",
  //       session_id: "8b798432f39c4dbb9ff194e9676d24ee",
  //       status: 1,
  //       statusNote: "",
  //       statusStr: "正常",
  //       thumbnailpics: [
  //         "https://qnwww2.autoimg.cn/youchuang/g12/M12/F3/82/autohomecar__wKjBy1h_VACABUh9AAw6Ln_Kdeg162.jpg?imageView2/1/w/400/h/225"
  //       ],
  //       title: "别再加价买丰田埃尔法了！开车如开房的奔驰V260",
  //       userid: 0,
  //       username: "",
  //       userpic: ""
  //     }, {
  //       content: "",
  //       description: "",
  //       identifiertype: "",
  //       imageheight: 0,
  //       imagewidth: 0,
  //       indexdetail: [],
  //       isattention: 0,
  //       iscandelete: 0,
  //       mediaid: "253604D950FF04EB",
  //       mediatype: 3,
  //       newsid: 90241,
  //       pics: [
  //         "https://qnwww2.autoimg.cn/youchuang/g12/M0E/ED/31/autohomecar__wKjBy1h255WACKKLAA_NOC8hYiA405.jpg?imageView2/2/w/640"
  //       ],
  //       playtime: "04:28",
  //       praisenum: 1436,
  //       publishtime: "2017-01-12",
  //       pv: 0,
  //       replycount: "623",
  //       seriesids: "2353",
  //       session_id: "a167ea00c2ef4c86a3678acebcf83706",
  //       status: 1,
  //       statusNote: "编辑待审核",
  //       statusStr: "正常",
  //       thumbnailpics: [
  //         "https://qnwww2.autoimg.cn/youchuang/g12/M0E/ED/31/autohomecar__wKjBy1h255WACKKLAA_NOC8hYiA405.jpg?imageView2/1/w/400/h/225"
  //       ],
  //       title: "【丈母娘唠车】第3期：够大够猛够装X的猛禽",
  //       userid: 0,
  //       username: "",
  //       userpic: ""
  //     }, {
  //       content: "",
  //       description: "",
  //       identifiertype: "",
  //       imageheight: 0,
  //       imagewidth: 0,
  //       indexdetail: [],
  //       isattention: 0,
  //       iscandelete: 0,
  //       mediaid: "5BA7DEC41E60AE9D",
  //       mediatype: 3,
  //       newsid: 89850,
  //       pics: [
  //         "https://qnwww2.autoimg.cn/youchuang/g16/M0D/EC/DC/autohomecar__wKjBx1h25B-AUrNxAAxgIlGjGC4520.jpg?imageView2/2/w/640"
  //       ],
  //       playtime: "02:40",
  //       praisenum: 1334,
  //       publishtime: "2017-01-05",
  //       pv: 0,
  //       replycount: "378",
  //       seriesids: "",
  //       session_id: "ab72c4f534884b9794d03f2e250f08e8",
  //       status: 1,
  //       statusNote: "编辑待审核",
  //       statusStr: "正常",
  //       thumbnailpics: [
  //         "https://qnwww2.autoimg.cn/youchuang/g16/M0D/EC/DC/autohomecar__wKjBx1h25B-AUrNxAAxgIlGjGC4520.jpg?imageView2/1/w/400/h/225"
  //       ],
  //       title: "【丈母娘唠车】第2期：到底是S码的TT还是super版的TT？",
  //       userid: 0,
  //       username: "",
  //       userpic: ""
  //     }, {
  //       content: "",
  //       description: "",
  //       identifiertype: "",
  //       imageheight: 0,
  //       imagewidth: 0,
  //       indexdetail: [],
  //       isattention: 0,
  //       iscandelete: 0,
  //       mediaid: "B47BFED4A32E844D",
  //       mediatype: 3,
  //       newsid: 89843,
  //       pics: [
  //         "https://qnwww2.autoimg.cn/youchuang/g19/M06/CC/36/autohomecar__wKgFWFh25FqABQKnAA7QKgPIfxc473.jpg?imageView2/2/w/640"
  //       ],
  //       playtime: "02:33",
  //       praisenum: 1508,
  //       publishtime: "2017-01-05",
  //       pv: 0,
  //       replycount: "510",
  //       seriesids: "4206",
  //       session_id: "9f94e9e02ed8490ca8b4fb4ba8785dd8",
  //       status: 1,
  //       statusNote: "编辑待审核",
  //       statusStr: "正常",
  //       thumbnailpics: [
  //         "https://qnwww2.autoimg.cn/youchuang/g19/M06/CC/36/autohomecar__wKgFWFh25FqABQKnAA7QKgPIfxc473.jpg?imageView2/1/w/400/h/225"
  //       ],
  //       title: "[丈母娘唠车第1期]胡姐带闺女体验沃尔沃S90",
  //       userid: 0,
  //       username: "",
  //       userpic: ""
  //     }],
  //     userinfo: {
  //       attentioncount: "2",
  //       bgimg: "https://x.autoimg.cn/app/image/pnvideodefult_small.jpg",
  //       desc: "胡永平，当年胡姐姐，今日丈母娘。不评车，只搞笑，只做3分钟……的视频。开心就好。",
  //       fanscount: "5.0万",
  //       isattention: 1,
  //       name: "丈母娘唠车丈母娘唠车丈母娘唠车丈",
  //       publishcount: "18",
  //       session_id: "43839fda8db54f3097e94c0534e44922",
  //       userpic: "",
  //       vcrrvideoimg: "https://x.autoimg.cn/app/image/pnvideodefult_small.jpg",
  //       vcrvideoid: ""
  //     }
  //   },
  //   returncode: 0

  // }
  // $('body').show();
  
  // // setTimeout(function(){
  // //   console.log(index, vm.data.tagListIndex)
  // //   // tagListIndex = index;
  // //   vm.renderAuthorPage(res.result);
  // //   vm.setImgWithBlur(res.result.userinfo);
  // //   vm.navWatch(res.result.userinfo);
  // // }, 3000)
  // vm.data.authInfo = res.result;
  // vm.data.isloadmore[index] = res.result.isloadmore || '';
  // vm.renderAuthorPage(res.result, index);
  // vm.setImgWithBlur(res.result.userinfo);
  // vm.navWatch(res.result.userinfo);
  // return;
  
  // mock
  var pid = flag ? vm.data.lastpageid : '';
  var dt = (vm.data.userId != vm.getParam('userId')) ? 2: 3;
  var vuserid = !!vm.getParam('userId') ? vm.getParam('userId'): '';

  vm.data.authInfo = {};
  vm.ajax({
    url: vm.data.url + '/npnewListforvuser.json',
    type: "GET",
    data: {
      pm: vm.mobileType() == 'iOS' ? 1 : 2,
      dt: dt, //主客页区分  主页3，客页2
      vuserid: vuserid,
      au: vm.data.userAuth,
      pid: pid,
      pagesize: 20,
      otype: 0,
      itype: vm.data.tagListIndex || 0
    },
    dataType: "json",
    success: function(res, xml) {
      res = JSON.parse(res);
      
      vm.data.isloadmore[index] = res.result.isloadmore || '';
      vm.data.lastpageid = res.result.lastid || '';

      vm.data.isAuthor = (vm.data.userId == vm.getParam('userId')) ? true: false;

      var pvMap = {
        eventid: vm.data.isAuthor ? 'chejiahao_bigvuser_pv': 'chejiahao_mainbigvuser_pv',
        pagename: vm.data.isAuthor ? 'chejiahao_bigvuser': 'chejiahao_mainbigvuser',
        isdata: res.result.userinfo? 1: 0
      };

      vm.chejiahaoPv(pvMap);

      if(!flag && index != vm.data.tagListIndex){
        return;
      }

      tagListIndex = index;
      if(res.result.userinfo){
        res.result.userinfo.userpic = res.result.userinfo.userpic + '&hybridCache=1';
        vm.data.authInfo = $.extend({},res.result);
        vm.renderAuthorPage(res.result, index);
      }            
    },
    fail: function(status) {
      ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
        ApiBridge.callNative('ClientViewManager', 'showLoadingView')
          vm.getAuthorPage(); 
      })
    }
  });
}


vm.initAuthorTag = function(index){

  tagListIndex = tagListIndex || 0;
  vm.data.tagListIndex = vm.data.tagListIndex || 0;
  // vm.data.tagListIndex = index || 0;

  //to do 本地存储点赞
  vm.data.likes = [];

  vm.data.isScrollAuthor = true;
  vm.getAuthorPage(index);
  vm.data.isLoad = true;

  //上拉翻页加载
  vm.upScroll(function() {
    if (!!vm.data.isLoad) {
      
      ApiBridge.log(vm.data.tagListIndex)
      ApiBridge.log('vm.data.tagList scroll')

      $('.c-loading').show();
      $('.c-tab-empty').hide();
      
      if (vm.data.tagListIndex !== 3) {
        ApiBridge.callNative('ClientVideoManager', 'deleteById', {
          mediaid: vm.data.mediaid,
        });
      }
      if (vm.data.tagListIndex !== 4) {
        ApiBridge.callNative('ClientAudioManager', 'deleteById', {
          mediaid: vm.data.mediaid,
        });
      }
      if(!!vm.data.isloadmore[vm.data.tagListIndex]){
        vm.data.isLoad = false;
        ApiBridge.log('vm.data.tagList index')
        vm.getAuthorPage(vm.data.tagListIndex, 'up');
      }
      else{
        vm.data.isLoad = true;
        $('.c-tab-empty').hide();
      }
    }
  });
   
  //监听销毁视频
  vm.deleteMediaWatch();
  vm.viewBounces();
}

// ios设置下拉时顶部空白设置
vm.viewBounces = function(){
  ApiBridge.callNative('ClientViewManager', 'setScrollViewBounces', {
    bounces: 0
  });

  window.addEventListener('scroll', function() {
    if(document.body.scrollTop <= 0){
      ApiBridge.callNative('ClientViewManager', 'setScrollViewBounces', {
        bounces: 0
      });
    }
    else{
      ApiBridge.callNative('ClientViewManager', 'setScrollViewBounces', {
        bounces: 1
      });
    }
  })  
}

//监听顶部导航
vm.navWatch = function(data) {
  vm.setNav({}, vm.data.authInfo);
  
  window.addEventListener('scroll', function() {
    var $scrollTop = document.body.scrollTop;
    var $titleHeight = $('.c-auth-title').height();

    var $offsetTop = $('.c-auth-title').offset().top;
    
    if($scrollTop >= ($offsetTop + $titleHeight)){
      vm.data.isIn = false;

      var info = {
        imgurl: vm.data.userinfo.userpic,
        title: vm.data.userinfo.name,
        icon2: 'articleplatform_icon_share',
        icon2_p: 'articleplatform_icon_share_p',
        navigationbacktype: 1,
        statusBarStyle: 0,
        alpha: 1
      };

      var type = $('.c-auth-follow').hasClass('on') ? 1 : 0;

      var icon1 = {
        icon1: type ? 'articleplatform_icon_correct' : 'articleplatform_icon_add',
        icon1_p: type ? 'articleplatform_icon_correct_p' : 'articleplatform_icon_add_p'
      };

      vm.setRightIcon(icon1);

      if(!vm.data.isOut){
        vm.data.isOut = true;
        
        vm.setNav(info, vm.data.authInfo);
      }
    }
    else{
      vm.setRightIcon({
        icon1: '',
        icon1_p: ''
      });
      vm.data.isOut = false;
      if(!vm.data.isIn){
        vm.data.isIn = true;
        vm.setNav({}, vm.data.authInfo);
      }
    }
  });
}

if (/author/.test(window.location.href)) {
  var tagListIndex = 0;
  vm.data.isLoad = true;
  // mock
  // vm.initAuthorTag();
  // mock 

  ApiBridge.callNative("ClientDataManager", "getNetworkState", {}, function(state) {
    vm.data.isNet = state.result;
    //未联网
    if (!Number(vm.data.isNet)) {
      ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
        ApiBridge.callNative('ClientViewManager', 'showLoadingView')
        vm.initAuthorTag();
      })
    } else {

      ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
        vm.data.userAuth = user.userAuth;
        vm.data.userId = user.userId;
        vm.initAuthorTag();    
      })
    }
  })
}