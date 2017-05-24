'use strict';

//点击删除某条信息
vm.deleteNewModal = function(e) {
  e.stopPropagation();
  vm.deleteNew(e);
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

  $parent.hide();
  vm.ajax({
    url: 'https://youchuangopen.api.autohome.com.cn/OpenInfoService.svc/DeleteForUserSelf',
    type: "POST",
    data: {
      newsid: newsid
    },
    dataType: "json",
    success: function(res, xml) {
      res = JSON.parse(res);
      if (res.result == 1) {
        $parent.hide();
      }
    },
    fail: function(status) {}
  });
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

  var icon = {};
  if(vm.data.userId != vm.getParam('userId')){
    icon = {
      icon1: info.icon1 || 'articleplatform_icon_share_w',
      icon1_p: info.icon1_p || 'articleplatform_icon_share_w_p'
    }
  }
  else{
    icon = {
      icon1: '',
      icon1_p: ''
    };
  }

  ApiBridge.callNative('ClientNavigationManager', 'setRightIcon', {
    righticons: icon
  }, function(res) {

    var opt = {
      share: {
        url: shareinfo.shareurl ||'',
        title: shareinfo.sharetitle ||'',
        logo: shareinfo.sharelogo ||'',
        icon: shareinfo.shareicon ||'',
        summary: shareinfo.sharesummary ||''
      }
    };
    ApiBridge.callNative('ClientShareManager', 'shareAction', opt, function(){

    });
    //to do share
  })
}
//高斯模糊设置
vm.setImgWithBlur = function(userinfo){
  var opt = {
    url: userinfo.userpic,
    set: {
      radius: 32,
      saturationdeltafactor: 1.8
    }
  };

  ApiBridge.callNative("ClientImageManager", "getImageWithBlur", opt, function(result) {
    var html = '<img class="c-auth-bg" src="data:image/jpeg;base64,' + result.result+'"/>';
    if(result.result){
      $('.c-auth-bg').html(html);
    }
  });
}

//渲染作者主页作者信息部分
vm.renderAuthorInfo = function(data, index){
  index = index || 0;

  var userinfo = data.userinfo;

  vm.data.isAuthor = (vm.data.userId == vm.getParam('userId')) ? true: false;

  //主页展示
  var html = '<div class="c-auth-native"></div>'
      + '<div class="c-auth-bg"></div>'
      + '<div class="c-auth-info">'
      +'<img id="c-auth-img" class="c-auth-img" userId=' + userinfo['userid'] + ' src=' + userinfo['userpic'] + ' />'
      + '<h3 class="c-auth-title">' + userinfo['name'] + '</h3>'
      + '<p class="c-auth-jj">' + userinfo['desc'] + '</p>'
      + '<p class="c-auth-tips">'
      + '<span class="c-auth-fans">' + userinfo['fanscount'] + ' 粉丝</span>' 
      + '<span class="c-auth-work">' + userinfo['publishcount'] + ' 作品</span>' 
      + '</p></div>';

  if(!vm.data.isAuthor){
    //客页
    html += '<p class="c-auth-f">'
      + '<a href="javascript:;" class="c-auth-follow ' + (userinfo['isattention'] == 1 ? 'on' : '') + '" userid=' + vm.getParam('userId') + ' username=' + userinfo['name'] + ' userpic=' + userinfo['userpic'] + ' userdesc=' + userinfo['desc'] + '>'+ (userinfo['isattention'] == 1 ?'已关注' :'<span>＋</span> 关注') + '</a>'
      + '</p>';
  }

  $('.c-auth-top').html(html);

  document.styleSheets[0].addRule('.c-auth-bg::before','background-image: url(' + userinfo['bgimg'] + ')');
  vm.renderAuthorNews(data, index);
}

//渲染作者主页
vm.renderAuthorPage = function(data, index){
  index = index || 0;

  // mock
  // vm.renderAuthorInfo(data, index);

  //mock
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
    data.map(function(v) {
      v['pv'] = v['pv'] || 0;

      if (v['mediatype'] == 4) {
        html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userId=' + v['userid'] + ' class=media-audio>' 
        + (vm.data.isAuthor && v['iscandelete'] == 1 ? '<a class="c-att-delete" newsid=' + v['newsid'] + ' userid=' + userinfo['userid'] + ' username=' + userinfo['name'] + ' userpic=' + v['userpic'] + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '></a>' : '')
        + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + userinfo['userpic'] + ' alt="">' 
        + '<p userId=' + v['userid'] + ' class="c-auth-title">' + userinfo['name'] + '</p></div>' 
        + '<div class="c-media-audio">' 
        + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') 
        + '<img class="c-auth-info-img" src=' + v['pics'] + ' alt=""></div><span class="c-tab-jj ">' + ((v['mediatype'] == 1 || v['mediatype'] == 4 || v['mediatype'] == 3) ? v['title'] : v['description']) + '</span></div>' 
        + '<p class="span c-tab-ue">' 
        + '<span class="c-zan" newsid=' + v['newsid'] + '><span class="zan-icon"></span><span class="c-num">' + (v['praisenum'] || 0) + '</span></span>' 
        + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + (v['replycount'] || 0) + '</span></span>' + '</p>' 
        + (v['status'] == 1 ? '<span class="c-looked">' + v['pv'] + ' 浏览</span>' : '<span class="c-error-tip">' + v['statusStr'] + ' </span>') 
         + '</li>';
      } else if (v['mediatype'] == 2) {

        var qingImg = '<div class="c-qing-img-wp" newsid=' + v['newsid'] + ' picurl=' + v['pics'] + ' sharecontent=' + v['description'] +  '>';

        if (v['pics'].length < 3) {
          qingImg = '<div class="c-qing-img-one"><img class="c-qing-img" imgnum=' + v['pics'].length + ' src=' + v['pics'][0] + ' /></div>'
        } else {
          v['pics'].map(function(k, i) {
            if (i > 2) {
              return;
            }
            qingImg += '<img class="c-qing-img" imgnum=' + v['pics'].length + ' src=' + k + ' />'
          })
        }
        if (v['pics'].length > 3) {
          qingImg += '<span class="c-qing-num">' + v['pics'].length + '</span></div>'
        } else {
          qingImg += '</div>'
        }
        html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userId=' + v['userid'] + ' class=media-qing>' 
        + (vm.data.isAuthor && v['iscandelete'] == 1 ? '<a class="c-att-delete" newsid=' + v['newsid'] + ' userid=' + userinfo['userid'] + ' username=' + userinfo['name'] + ' userpic=' + v['userpic'] + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '></a>' : '')
        + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + userinfo['userpic'] + ' alt="">' + '<p userId=' + v['userid'] + ' class="c-auth-title">' + userinfo['name'] + '</p></div>' 
        + '<div class="c-media-audio">' 
        + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') + '</div><span class="c-tab-jj ">' + ((v['mediatype'] == 3 || v['mediatype'] == 4 || v['mediatype'] == 1) ? v['title'] : v['description']) + '</span>' + qingImg + '</div>' 
        + '<p class="span c-tab-ue">' 
        + '<span class="c-zan" newsid=' + v['newsid'] + '><span class="zan-icon"></span><span class="c-num">' + (v['praisenum'] || 0) + '</span></span>' 
        + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + (v['replycount'] || 0) + '</span></span>' + '</p>' 
        + (v['status'] == 1 ? '<span class="c-looked">' + v['pv'] + ' 浏览</span>' : '<span class="c-error-tip">' + v['statusStr'] + ' </span>') 
         + '</li>';
      } else {

        html += '<li newsid=' + v['newsid'] + ' mediatype=' + v['mediatype'] + ' userId=' + v['userid'] + ' >' 
        + (vm.data.isAuthor && v['iscandelete'] == 1 ? '<a class="c-att-delete" newsid=' + v['newsid'] + ' userid=' + userinfo['userid'] + ' username=' + userinfo['name'] + ' userpic=' + v['userpic'] + ' usertitle=' + v['title'] + ' userdesc=' + v['description'] + '></a>' : '')
        + '<div userid=' + v['userid'] + ' class="c-media-info"><img userId=' + v['userid'] + ' class="c-auth-img" src=' + userinfo['userpic'] + ' alt="">' 
        + '<p userId=' + v['userid'] + ' class="c-auth-title">' + userinfo['name'] + '</p></div>' 
        + '<p class="c-tab-jj ' + (v['mediatype'] == 1 ? 'short' : 'long') + '">' + ((v['mediatype'] == 1 || v['mediatype'] == 4 || v['mediatype'] == 3) ? v['title'] : v['description']) + '</p>' 
        + '<div mediatype=' + v['mediatype'] + ' title=' + v['title'] + ' thumbnailpics=' + v['thumbnailpics'] + ' playtime=' + v['playtime'] + ' status=' + v['status'] + ' mediaid=' + v['mediaid'] + ' class="c-tag-media">' + ((v['mediatype'] == 3 || v['mediatype'] == 4) ? '<span class="c-tag-video"></span>' : '') 
        + '<img class="c-auth-info-img" src=' + v['pics'] + ' alt="">' 
        + (v['mediatype'] == 3? '<span class="c-tag-video-time">' + v['playtime'] + '</span>' : '')
        + '</div>' 
        + '<p class="span c-tab-ue">' 
        + '<span class="c-zan" newsid=' + v['newsid'] + '><span class="zan-icon"></span><span class="c-num">' + (v['praisenum'] || 0) + '</span></span>' 
        + '<span class="c-common" newsid=' + v['newsid'] + ' type=' + v['mediatype'] + '><span class="c-num">' + (v['replycount'] || 0) + '</span></span>' 
        + '</p>' 
        + (v['status'] == 1 ? '<span class="c-looked">' + v['pv'] + ' 浏览</span>' : '<span class="c-error-tip">' + v['statusStr'] + ' </span>') 
         + '</li>';
      }
    })

    if (!vm.data.isLoad) {
      $('.c-tab-bd ul').eq(index).append(html);
    } else {
      $('.c-tab-bd ul').eq(index).html(html);
    }

    $('.c-tab-bd ul li').each(function(v, i) {
      if ($(i).attr('mediatype') == 4) {
        return
      };
      $(i).find('.c-auth-info-img').height($(i).find('.c-auth-info-img').width() * 0.5625);
      if ($(i).attr('mediatype') == 2) {
        $(i).find('.c-qing-img').height($(i).find('.c-qing-img').width() * 0.5625);
      }
    })

    $('.c-loading').hide();
    vm.data.isLoad = true;
    // if(num == 1){
    //   document.body.scrollTop = 0;
    // }
  }
}

//获取作者主页  
vm.getAuthorPage = function(index){
  index = index || 0;

  // mock

  // var res = {
  //   message: "",
  //   result: {
  //     isloadmore: 0,
  //     lastid: "2017-01-05 15:42:09023|89843",
  //     newslist: [{
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
  //       seriesids: "",
  //       session_id: "81dd865770894ab3bd0b41b1c918c770",
  //       status: 1,
  //       statusNote: "",
  //       statusStr: "正常",
  //       thumbnailpics: [
  //         "https://qnwww2.autoimg.cn/youchuang/g12/M09/9F/E9/autohomecar__wKgH01kbPDuAI3xSAAGNMMeSgqk414.jpg?imageView2/1/w/200/h/200",
  //         "https://qnwww2.autoimg.cn/youchuang/g12/M0C/A9/7B/autohomecar__wKgH4lkbPFSAActaAAF5vXvNJdU798.jpg?imageView2/1/w/200/h/200"
  //       ],
  //       title: "",
  //       userid: 0,
  //       username: "",
  //       userpic: "https://qnwww2.autoimg.cn/youchuang/g6/M0D/E3/67/autohomecar__wKgHzVht7DKANOYBAAEk9BBTtuA095.jpg?imageView2/1/w/120/h/120"
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
  //       mediatype: 3,
  //       newsid: 91996,
  //       pics: [
  //         "https://qnwww2.autoimg.cn/youchuang/g11/M0B/07/98/autohomecar__wKgH0liix22Acy7HAA7qxSaViaI155.jpg?imageView2/2/w/640"
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
  //       isattention: 0,
  //       name: "丈母娘唠车",
  //       publishcount: "18",
  //       session_id: "43839fda8db54f3097e94c0534e44922",
  //       userpic: "https://qnwww2.autoimg.cn/youchuang/g6/M0D/E3/67/autohomecar__wKgHzVht7DKANOYBAAEk9BBTtuA095.jpg?imageView2/1/w/120/h/120",
  //       vcrrvideoimg: "https://x.autoimg.cn/app/image/pnvideodefult_small.jpg",
  //       vcrvideoid: ""
  //     }
  //   },
  //   returncode: 0

  // }
  // vm.renderAuthorPage(res.result, index);
  // vm.setImgWithBlur(res.result.userinfo);
  // vm.navWatch(res.result.userinfo);
  // return;
  
  //mock
  
  vm.ajax({

    url: vm.data.url + '/npnewListforvuser.json',
    type: "GET",
    data: {
      pm: vm.mobileType() == 'iOS' ? 1 : 2,
      dt: 2,
      vuserid: vm.getParam('userId'),
      au: vm.data.userAuth,
      pid: vm.data.lastpageid || '',
      pagesize: 20,
      otype: 0,
      itype: index || 0
    },
    dataType: "json",
    success: function(res, xml) {
      res = JSON.parse(res);
      vm.data.isloadmore = res.result.isloadmore || '';
      vm.data.lastpageid = res.result.lastid || '';

      vm.renderAuthorPage(res.result, index);
      vm.setImgWithBlur(res.result.userinfo);
      vm.navWatch(res.result);


    },
    fail: function(status) {
      ApiBridge.callNative('ClientViewManager', 'loadingFailed', {}, function() {
        ApiBridge.callNative('ClientViewManager', 'showLoadingView')
          vm.initAuthorTag(); 
      })
    }
  });
}

vm.initAuthorTag = function(index){

  index = index || 0;

  //to do 本地存储点赞
  vm.data.likes = [];

  vm.getAuthorPage(index);

  //上拉翻页加载
  vm.upScroll(function() {
    if (!!vm.data.isLoad) {
      vm.data.isLoad = false;
      $('.c-loading').show();

      if (index !== 3) {
        ApiBridge.callNative('ClientVideoManager', 'deleteById', {
          mediaid: vm.data.mediaid,
        });
      }
      if (index !== 4) {

        ApiBridge.callNative('ClientAudioManager', 'deleteById', {
          mediaid: vm.data.mediaid,
        });

        var audioEl = $('.c-tab-list').find('.c-tag-audio');
      
        if(audioEl.length){
          audioEl.map(function(index, item){
            $(item).removeClass('c-tag-audio');
          })
        }
      }
      vm.getAuthorPage(index);
    }
  });
   
  //监听销毁视频
  vm.deleteMediaWatch();
}

//监听顶部导航
vm.navWatch = function(data) {
  vm.setNav({}, data);

  window.addEventListener('scroll', function() {
    var $scrollTop = document.body.scrollTop;
    var $titleHeight = $('.c-auth-title').height();

    var $offsetTop = $('.c-auth-title').offset().top;
    
    if($scrollTop >= ($offsetTop + $titleHeight)){
      var info = {
        imgurl: data.userinfo.userpic,
        title: data.userinfo.name,
        icon1: 'articleplatform_icon_share',
        icon1_p: 'articleplatform_icon_share_p',
        navigationbacktype: 1,
        statusBarStyle: 0,
        alpha: 1
      };

      if(!vm.data.hasSetNav){
        vm.setNav(info, data);
        vm.data.hasSetNav = true;
      }
      // vm.setNav(info, data)
    }
    else{
      vm.data.hasSetNav = false;
      vm.setNav({}, data);
    }
    
  });
}

if (/author/.test(window.location.href)) {
  // setNavBackIcon
  ApiBridge.callNative('ClientViewManager', 'hideLoadingView');

  ApiBridge.callNative('ClientViewManager', 'hideLoadingView');
  // mock
  // vm.initAuthorTag();
  //mock 
  ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
    vm.data.userAuth = user.userAuth;
    vm.data.userId = user.userId;
    vm.initAuthorTag();    
  })
}