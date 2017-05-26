//绑定事件
vm.bindEvent = function() {

  //点击关注 或者 跳转作者客页
  $('.js-follow-v-list').on('click', 'li', vm.author2);
  $('.js-follow-list').on('click', 'li', vm.author2);

  //标签部分视频点击创建
  $('.js-tag-list').on('click', '.c-tag-media', vm.createMedia);

  //关注更多 -->跳转作者客页
  $('.js-follow-more-list').on('click', 'li', vm.author2);

  //标签列表 -->评论跳转到评论页
  $('.js-tag-list').on('click', '.c-common', vm.tagCommon);

  //标签列表 -->跳转文章最终页
  $('.js-tag-list').on('click', 'li', vm.article);

  //作者主页点击关注
  $('.c-wp').on('click', '.c-auth-follow', vm.article);

  //标签列表 -->点击头像或名字跳转个人主页
  //$('.js-tag-list').on('click', '.c-media-info', vm.author2);

  //标签列表 -->点赞动作
  $('.js-tag-list').on('click', '.c-zan', vm.likeZan);

  //点击作者主页Tag获得TagId对应的News列表
  $('.c-tab-title').on('click', 'li', vm.getTagContent);

  //跳转关注更多
  $('.c-att-more').on('click', vm.followV);

  //点击关注更多左侧bar 获取右侧list
  $('.js-follow-more-bar').on('click', 'li', vm.getFollowMore);

  //点击标签列表页轻文图片跳转大图预览
  $('.js-tag-list').on('click', '.c-qing-img', vm.getQingInfo);

  //作者主页 -->点赞
  $('.c-tab-list').on('click', '.c-zan', vm.likeZan);

  //作者主页 -->评论跳转到评论页
  $('.c-tab-list').on('click', '.c-common', vm.tagCommon);

  //作者主页 点击轻文图片跳转大图预览
  $('.c-tab-list').on('click', '.c-qing-img', vm.getQingInfo);

  //作者主页 -->跳转文章最终页
  $('.c-tab-list').on('click', 'li', vm.article);

  //标签部分视频点击创建
  $('.c-tab-list').on('click', '.c-tag-media', vm.createMedia);

  //点击作者头像获取UserId跳转作者主页
  // $('.js-tag-list').on('click', '.c-auth-img', vm.author2);
}

//点击作者头像获取UserId跳转作者主页
vm.toAuthor = function(userId) {
  ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
    var pagetype = (user.userId == userId) ? 5 : 7;
    // var icon = (user.userId == userId) ? 5 : ;

    ApiBridge.callNative('ClientViewManager', 'pushViewController', {
      pagetype: pagetype,
      animationtype: 1,
      set: {
        modename: 'author',
        ispagefullscreen: 1,
        navigationalpha: 0,
        navigationbacktype: 1,
        // navigationrighticon: {
        //   icon1: 'articleplatform_icon_share_p',
        // },
        navigationtype: 2
      },
      param: {
        userId: userId
      }
    });

  })
}

vm.author2 = function(e) {
  e.stopPropagation();
  var $followTarget = e.target;
  var $curTarget = $(e.currentTarget);
  
  if ($followTarget.tagName == 'A') {
    console.log('ddddd')
    var $type = $($followTarget).hasClass('on') ? 1 : 0;
    var $info = {
      imgurl: $($followTarget).attr('userpic'),
      time: $($followTarget).attr('usertime') || '',
      userid: $($followTarget).attr('userid'),
      title: $($followTarget).attr('title'),
      description: $($followTarget).attr('userdesc') || '',
      username: $($followTarget).attr('username')
    }
    vm.followToggle($($followTarget).attr('userid'), $type, $info, $($followTarget));
    return;
  }

  // mock
  // var pagetype = (vm.data.userId == userId) ? 7 : 5;
  // vm.toAuthor(pagetype, userId);

  // mock
  
    ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
      var pagetype = (user.userId == userId) ? 5 : 7;
      vm.toAuthor(pagetype, userId);
    })
}

vm.article = function(e) {
  e.stopPropagation();

  var $followTarget = e.target;
  var $curTarget = e.currentTarget;

  if(e.target.className == 'c-auth-img' || e.target.className == 'c-auth-title'){
    ApiBridge.callNative("ClientDataManager", "getUserInfo", {}, function(user) {
      var pagetype = (user.userId == userId) ? 5 : 7;
      vm.toAuthor(pagetype, userId);
    })
    return;
  }
  //头像空白页跳转到最终页
  if(e.target.className == 'c-media-info'){
    ApiBridge.callNative('ClientViewManager', 'pushViewController', {
      pagetype: 2,
      animationtype: 2,
      param: {
        newsid: $($followTarget).parent('li').attr('newsid'),
        type: $($followTarget).parent('li').attr('mediatype'),
        autoscrolltocomment: 0
      }
    });
    return;
  }
  if (e.target.tagName != 'LI' && e.target.className == 'c-qing-img' &&  $(e.target).attr('imgnum') >= 3) {
    return;
  }

  if(e.target.className == 'c-att-delete'){
    vm.deleteNewModal(e);
    return;
  }

  if (e.target.tagName == 'A') {
    console.log('ddddd')
    var $type = $(e.target).hasClass('on') ? 1 : 0;
    var $info = {
      test: '11',
      imgurl: $($followTarget).attr('userpic'),
      time: $($followTarget).attr('usertime') || '',
      userid: $($followTarget).attr('userid'),
      title: $($followTarget).attr('title'),
      description: $($followTarget).attr('userdesc') || '',
      username: $($followTarget).attr('username')
    }
    
    vm.followToggle($($followTarget).attr('userid'), $type, $info, $($followTarget));
    return;
  }
  if (e.target.className == 'c-auth-info-img' && ($($curTarget).attr('mediatype') == 3 || $($curTarget).attr('mediatype') == 4)) {
    return;
  }
  if (e.target.tagName != 'LI' && e.target.className != 'c-qing-img' && e.target.className != 'c-auth-info-img' && (e.target.className != 'c-tab-jj ' && e.target.className != 'c-tab-jj short' && e.target.className != 'c-tab-jj long')) {
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
}
//点击tab获取相应的列表
vm.getTagContent = function(e) {
  e.stopPropagation();

  document.body.scrollTop = 0;
  vm.data.isLoad = true;
  
  $target = $(e.currentTarget);

  if ($target.index() !== 3) {
    ApiBridge.callNative('ClientVideoManager', 'deleteById', {
      mediaid: vm.data.mediaid,
    });
  }
  if ($target.index() !== 4) {

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

  vm.getAuthorPage($target.index());
}

vm.bindEvent();
