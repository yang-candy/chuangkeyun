$(function () {

  var audio = $('#media')[0];
  var $document = $('.section');
  var isTouchMove, startTy;
  var $clock = $('.js-clock');

  $clock.on('touchstart', function(e){
    var touches = e.touches[0];
    startTy = touches.clientY;
    isTouchMove = false;
  });

  var i = 0;
  $clock.on( 'touchmove', function(e){
    var touches = e.touches[0];
    var dY = touches.clientY - startTy;
    dY = dY/10;

    if(dY > 0){
      return;
    }
    if($clock[0].offsetTop <= '15'){
      $clock.css('top','2px');
      return;
    }

    $clock.css('top',$clock[0].offsetTop + dY + 'px')
    e.preventDefault();
  });

  $('.js-clock').on('touchend', function(e){
    //startTy = 0; 
    if($clock[0].offsetTop == 2){
      i++;
      if(i>1 && i<3){
        i = 2;
        showNext(2);
      }
    }
    if(!isTouchMove){
      return;
    }
  });

  //展示下一屏
  var i = 1;
  function showNext(i,isUp){
    if(!isUp){
      $('.section' + (i + 1)).removeClass('show').addClass('hide');
      return;
    }
    if(!!isUp || i == 2){
      $('.section' + i).addClass('show').removeClass('hide');
    }
  }

  var isUp = false;
  //整屏滑动
  $document.on('touchstart',function(e){
    var $touch = e.touches[0];
    startTy = $touch.clientY;
    audio.play(); 
  })

  $document.on('touchmove',function(e){
    var $touch = e.touches[0];
    var $target = e.target;

    var dY = $touch.clientY - startTy;
    isUp = dY < 0 ? true : false;
  })

  $document.on('touchend', function(e){
    var $target = e.target;
    if(i > 7 && !isUp){
      i-- ;
      showNext(i - 1,isUp);
      return;
    }
    if($($target).parents('.clock-wp').hasClass('section1') || i == 1 || i > 7){
      return;
    }
    if($target.tagName == 'P' || $target.tagName == 'IMG'){
      window.open('http://api.map.baidu.com/geocoder?address=北京北大博雅国际酒店大学堂2号厅&output=html','_blank')
      return;
    }
    //第一个
    if(!isUp && i == 2){
      return;
    }
    if(!!isUp){
      i++;
    }else{
      i--;
    }
    showNext(i - 1,isUp);
  })

  function audioAutoPlay(id){
    var audio = document.getElementById(id);
    audio.play();
    document.addEventListener("WeixinJSBridgeReady", function () {
      audio.play();
    }, false);
  }
  audioAutoPlay('media');
  //暂停音乐
  $('.music').on('click',function(){
    $('.music').toggleClass('rotate');
    if(audio.paused){
      audio.play();
    }else{
      audio.pause();
    }
  })
});

