var vm = {
  init:(function(){
    if (window.Notification && window.Notification.permission !== "granted") {
      window.Notification.requestPermission(function(permission){
        //点击禁止或同意的回调
        if(permission == 'granted' || permission == 'denied'){
          //to do
        }
      });
    }
  })(),
  //调取推送方法
  notic:function(json){
    if (window.Notification) {
      json = json || {};
      //根据id判断是否推送
      if(json.id && json.name  && (vm.getLs(json.name + 'Id') == json.id)){
        return;
      }else{
        vm.setLs(json.name + 'Id',json.id);
      };
      var n = new Notification(
        json.title || '这是标题', {
        icon : json.icon || 'http://img1.gtimg.com/ninja/2/2017/03/ninja149057261625932.jpg',
        body : json.body || '3秒后自动关闭',
        data : json.data || 'http://www.autohome.com.cn'
      });
      n.onclick = function (e) {
        var $target = e.currentTarget;
        window.open($target.data,'_blank')
        window.focus();
        n.close();
      };
    }
  },
  //保存到localStorage
  setLs: function(key,value){
    if(!key) return; 
    value = (typeof value == 'string') ? value : JSON.stringify(value);
    window.localStorage.setItem(key,value);
  },
  getLs: function(key){
    if(!key) return;
    var value = window.localStorage.getItem(key);
    return JSON.parse(value);
  }
};
