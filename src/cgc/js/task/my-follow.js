// # 我的关注

//获取我的关注ajax
vm.followAjax = function(url, opt) {
  opt = opt || {};
  // mock
  // var res = {
  //   "message": "",
  //   "result": {
  //       "isloadmore": 0,
  //       "lastpageid": "",
  //       "vuserlist": [
  //           {
  //               "createtime": "2017-01-16",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "探访王四营桥事故现场 下篇",
  //               "userdesc": "把汽车当成玩具的恐怕只有孩子，你还记得把汽车当成玩具是哪年的事吗？如果不记得了，我们就来一起找回那段逝去的无邪时光吧！",
  //               "userid": 205625,
  //               "username": "白活白活车",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g11/M15/4C/29/autohomecar__wKjBzFfew62Ac5ldAAR1TWkBy20086.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "EP9纽北跑圈视频来啦，顺便扒一扒蔚来的小“心机”",
  //               "userdesc": "爱学习，爱体验，爱分享，做牛逼闪闪的老司机。《名车志》副主编，“丁丁说车”和“一车一路”出品人，“丁丁刀刀聊汽车”主播。",
  //               "userid": 4022194,
  //               "username": "丁丁",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g15/M0D/07/9F/autohomecar__wKgH1liiB2SAcoxnAAMx6jdsDO4539.JPG?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "视知车学院：独立悬挂的操控性到底好在哪儿？",
  //               "userdesc": "说人话，聊车事。3分钟看懂汽车硬知识。视知TV矩阵成员。",
  //               "userid": 5981156,
  //               "username": "视知车学院",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g16/M04/C3/B7/autohomecar__wKjBx1hODJGATVNRAAEcZPbeLZQ316.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "捷达1.5：排量缩小0.1升，能省出多少买菜钱？",
  //               "userdesc": "大家车言论、大家CARS创始人，国内知名车评人",
  //               "userid": 10298382,
  //               "username": "颜宇鹏-车言论",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g22/M04/BF/3E/autohomecar__wKjBwVeXCmWAY3ttAAIr-6uZIn8273.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "【试“小钢炮”奥迪新A3！2.0T动力杠杠的！骚绿配色装B利器！】\n \n试驾车是台新增的喀纳斯绿的A3 40TFSI（25.5万），配上新的运动包围和前脸，真有点“小Sao萌”，只要不转到车后，乍一看就是辆“S3”啊（S3为双边双",
  //               "userdesc": "汽车洋葱圈，你的汽车福利社。这里传递正能量，揭穿各种汽车黑幕、赠送买车防忽悠秘笈，更有实用的购车、用车终极妙招！",
  //               "userid": 13127914,
  //               "username": "汽车洋葱圈",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g16/M05/71/99/autohomecar__wKjBx1crCMGASfUZAAJqnC9lmpo666.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-17",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "跑车的后座坐不下“长腿美女”，那到底用来干啥？",
  //               "userdesc": "权威，新鲜，专业，省钱，奇葩的第一原创汽车新媒体，丰富你的用车生活。",
  //               "userid": 15781968,
  //               "username": "有车以后",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g8/M02/73/48/autohomecar__wKjBz1c0TKuAbWPcAAPyj3TGW8k467.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2016-07-24",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "打小抄，并不光彩！",
  //               "userdesc": "侃车聊车尽在車之匠；爱车，懂车就加入我们吧！",
  //               "userid": 18052369,
  //               "username": "車匠",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g12/M09/A6/3E/autohomecar__wKgH01dhUm2APK9TAABtggvQl3s460.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "澳洲颜值车评系列：全新福特Escape超越自我才是最大进步",
  //               "userdesc": "全球汽车猛料的无障碍通道,第一时间送上海外新鲜车评熟肉！有字幕看得就是爽。",
  //               "userid": 20582257,
  //               "username": "66车讯",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g14/M04/55/49/autohomecar__wKgH1Vfo0eGAGrrbAABMRXr6zN0732.png?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-17",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "向极致更进一步 米其林 PILOT Sport 4 S",
  //               "userdesc": "《萝卜报告》是由陈震主持的汽车评测类节目。对每一款汽车进行详细讲解，让您对每一款车了如指掌，在购买汽车时给您最大的帮助。",
  //               "userid": 21728864,
  //               "username": "萝卜报告",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g23/M02/59/0B/autohomecar__wKjBwFcwKv-AeVP3AAFFeoW6gAQ892.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "你以为停车就是关上门？不少人不懂这6条毁车伤人",
  //               "userdesc": "买车 用车 玩车 您身边的汽车采购驾驶专家  全球第一手的新车视频 最易懂的新车图片解析   30秒懂车 懂车更懂你",
  //               "userid": 21872398,
  //               "username": "30秒懂车",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g17/M01/78/68/autohomecar__wKgH51j_BZaAeuk4AAAe2UkiIuE031.png?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "来看看世界最“大”的“车模”专卖店",
  //               "userdesc": "吴佩频道：由车评人吴佩创立，和他的朋友们一起，专为深度懂车、玩车人群、意见领袖打造的一个高端受众品牌。",
  //               "userid": 21974248,
  //               "username": "吴佩频道",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g4/M14/77/45/autohomecar__wKjB01cxVI2ADySAAAAy4fmzQl4885.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "现代i30 N谍照曝光，韩系小钢炮味道如何？",
  //               "userdesc": "源自德国，70年专注汽车测试，让你了解和喜欢汽车！",
  //               "userid": 23208227,
  //               "username": "ams车评网",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g12/M09/81/1B/autohomecar__wKgH4lc5f1GAQ5LKAABIRurybWk591.png?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-25",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "弃用王者4G63，最后街头霸王三菱EVO X",
  //               "userdesc": "给你最燃的汽车文化。",
  //               "userid": 26949360,
  //               "username": "JSFamily集视家",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g19/M09/63/AF/autohomecar__wKgFWFc8KoSAB-mmAADgUABPTBo195.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-17",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "XC90车头撞碎了人没事？沃尔沃为了吹自己安全，直接卡车轧人头！",
  //               "userdesc": "全宇宙汽车人最爱的娱乐星球",
  //               "userid": 28642583,
  //               "username": "汽车娱乐星球",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g22/M13/46/F6/autohomecar__wKgFW1jciQOATKrlAAN_fSnf-DA020.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "一分钟内决定要不要买沃尔沃",
  //               "userdesc": "看AV，不如看玩车TV",
  //               "userid": 29160551,
  //               "username": "玩车TV",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g23/M04/B1/76/autohomecar__wKgFV1eIQOSAfOyUAAfDcnLKi3g029.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "这两天大家都被一台34升油能跑768km的别克刷屏了，在这样的日子里，我觉得有必要谈谈通用曾经在电动车上的发展史，还记得1993年开始开发，2003年项目最终终止的EV1么？你问我他是什么标的？这大概是通用旗下唯一一款",
  //               "userdesc": "我们是一群专业、风趣、搞怪、有思想的汽车媒体人。传播汽车文化，解决购车烦恼，普及养护知识。",
  //               "userid": 32274227,
  //               "username": "车主之友",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g9/M09/9E/27/autohomecar__wKgH31glbmqAKz5hAAFoVpx7zgw691.png?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "途观L同平台价格低三万 柯迪亚克怎么选最划算？",
  //               "userdesc": "一档基于车主和准车主用户的全国性汽车评测类栏目，为车友提供识车、选车，及玩车参考！更多有趣爆料：chaojishijia@vip.qq.com",
  //               "userid": 34693284,
  //               "username": "超级试驾",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g9/M01/B3/A6/autohomecar__wKjBzlhE6HmAF_69AABlC-OAo7U885.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "奥迪S3拉圣诞树动态展示！",
  //               "userdesc": "全国汽车改装爱好者聚集地,弘扬改装车文化!【理性改装,文明行车,抵制飙车!】每天为你提供最精彩的:改装资讯、改装案例、改装视频",
  //               "userid": 34964049,
  //               "username": "改装车",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g6/M09/B2/83/autohomecar__wKjB0Vg7zsOAQ1BwAA3PiQqGq44685.png?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "纽北最速SUV之争，挑战阿尔法·罗密欧Stelvio，兰博基尼Urus在北环赛道被抓拍谍照。近日，兰博基尼旗下首款SUV产品Urus在纽博格林北环赛道被抓拍到全伪装谍照，除了在赛道进行常规测试之外，该车型很有可能在为日后",
  //               "userdesc": "这车值不值？老任说了算！\n老任是谁？《童济仁》十年幕后推手！\n科班出身！观点犀利！不服来战！",
  //               "userid": 37685570,
  //               "username": "这车值么",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g15/M0C/0C/8A/autohomecar__wKgH1limxiCAKNibAALVQNIilNI853.png?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-17",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "下赛道也不惧911 GT3，为啥那么多人说：宝马你这是要上天啊！",
  //               "userdesc": "打死我都不写“十万块买什么车”这种文章！",
  //               "userid": 37953579,
  //               "username": "汽车杂志",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g23/M0B/5E/54/autohomecar__wKgFXFkAMpaAVG9-AACODAq3sng264.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-18",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "电动车真比汽油车环保吗？不是厂商说了算，这才是真相！",
  //               "userdesc": "说实话，我们很矫情。",
  //               "userid": 39356249,
  //               "username": "汽车评中评",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g9/M11/54/73/autohomecar__wKjBzljsQ52AWTKgAADEllW0O8w133.jpg?imageView2/1/w/120/h/120"
  //           },
  //           {
  //               "createtime": "2017-05-17",
  //               "fansnum": "0",
  //               "isattention": 1,
  //               "title": "最低也有700匹，这9款车乃是当今市面上最疯狂的功率怪兽！",
  //               "userdesc": "欢迎来到TG星球，这里可能比其他地方有趣那么一点点。《TopGear汽车测试报告》是BBC旗下TopGear品牌杂志的简体中文版。",
  //               "userid": 40259878,
  //               "username": "TopGear汽车测试报告",
  //               "userpic": "https://qnwww2.autoimg.cn/youchuang/g14/M01/5E/16/autohomecar__wKgH5FjsWxCANOmbAAAWnFHgLfs429.jpg?imageView2/1/w/120/h/120"
  //           }
  //       ]
  //   },
  //   "returncode": 0
  // }

  // if (!!res.result.vuserlist.length) {
  //   $('.js-follow-more').show();
  //   $('.js-follow-v').hide();
  //   vm.followList(res.result.vuserlist, 1, 'net', vm.data);
  // } else {
  //   //已登录本地数据没有
  //   if (opt.au) {
  //     vm.getV();
  //   } else {
  //     $('.c-tab-empty').show();
  //   }
  // }
  // mock
  // 
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
      $('.c-loading').hide();
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
      $('.c-loading').hide();
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
  // mock
  // vm.followAjax(vm.data.url + "/npgetvuserlist.json", {
  //   dt: 1,
  //   au: ''
  // })
  // mock
  // 
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
          $('.c-loading').hide();
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
