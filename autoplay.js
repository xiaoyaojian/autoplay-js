window.cc_js_Player.showPlayer = function () {
  try {
    var head = document.getElementsByTagName("head")[0] || document.documentElement;
    var ucVideoRecording = document.createElement("style");
    ucVideoRecording.classList.add('ccH5videoStyleTag')
    ucVideoRecording.innerHTML = "body .uc-video-toolbar{display:none !important;}";
    head.appendChild(ucVideoRecording);
  } catch (e) {

  }

  var scripts = document.getElementsByTagName("script");
  for (var i = 0; i < scripts.length; i = i + 1) {
    var script = scripts[i];
    //测试环境 修改地址 https://p.bokecc.com/player   to   p.js
    if (script.src.indexOf("http://union.bokecc.com/player") == -1 && script.src.indexOf("http://p.bokecc.com/player") == -1
      && script.src.indexOf("https://union.bokecc.com/player") == -1 && script.src.indexOf("https://p.bokecc.com/player") == -1
    ) {
      continue;
    }
    var src = script.src;
    script.src = "";
    var params = this.getParam(src.split("?")[1]);
    this.params = params;
    this.params.autoStart = 'true';
    var video = document.createElement("div");
    var randomid = Math.ceil(Math.random() * 10000000);
    video.id = "cc_video_" + params.vid + "_" + randomid;
    params.divid = video.id;
    video.style.width = params.width;
    video.style.height = params.height;
    if (this.isMoble()) {
      video.style.position = "relative";
    }
    video.innerHTML = "";

    // save video params
    this.videoInfo.push(params);
    script.parentNode.replaceChild(video, script);
    var t = new Date().getTime() + '_' + randomid;
    cc_js_Player.paramsObj[t] = params;
    this.jsonp("https://imedia.bokecc.com/servlet/mobile/adloader?uid=" + params.siteid + "&vid=" + params.vid + "&type=1&t=" + t, "cc_js_Player.videoLoad", function () {
      param = params;
      var authCode = '';
      if (typeof window.get_cc_verification_code != 'undefined') {
        authCode = encodeURIComponent(get_cc_verification_code(param.vid));
      }
      if (cc_js_Player.isAndroid() && !cc_js_Player.isAndroid2()) {
        cc_js_Player.jsonp("https://p.bokecc.com/servlet/getvideofile?vid="
          + param.vid + "&siteid=" + param.siteid + "&divid="
          + param.divid + "&width=" + encodeURIComponent(window.screen.width, "UTF-8") + "&useragent="
          + param.userAgent + "&version=20140214" + "&hlssupport=1&vc=" + authCode + "&mediatype=" + param.mediatype, "cc_js_Player.showPlayerView");
      } else if (cc_js_Player.isIPhone() || cc_js_Player.isIPad()) {
        cc_js_Player.jsonp("https://p.bokecc.com/servlet/getvideofile?vid="
          + param.vid + "&siteid=" + param.siteid + "&divid="
          + param.divid + "&width=" + encodeURIComponent(param.width, "UTF-8") + "&useragent="
          + param.userAgent + "&version=20140214" + "&hlssupport=1&vc=" + authCode + "&mediatype=" + param.mediatype, "cc_js_Player.showPlayerView");
      } else {
        cc_js_Player.jsonp("https://p.bokecc.com/servlet/getvideofile?vid="
          + param.vid + "&siteid=" + param.siteid + "&divid="
          + param.divid + "&width=" + encodeURIComponent(param.width, "UTF-8") + "&useragent="
          + param.userAgent + "&version=20140214" + "&hlssupport=1&vc=" + authCode + "&mediatype=" + param.mediatype, "cc_js_Player.showPlayerView");
      }
    });
  }
}

$('.article-li').off('click.autoplay');

$('.article-li').on('click.autoplay', function () {
  function getCurrentCourseDuration(){
    var dtd = $.Deferred();
    var elapsed = 0;
    var interval1 = window.setInterval(function(){
      elapsed += 5;
      try{
        var duration = player.getDuration();
        var position = player.getPosition();
        if(duration != null && duration > 0){
          dtd.resolve({duration: duration - position + elapsed, realDuration: duration});
          console.log('duration: ' + duration);
          console.log('position: ' + position);
          window.clearInterval(interval1);
        } 
      } catch(ex){
        console.error(ex)
      }
    },5000)
    return dtd.promise();
  }

  function autoClickNextCourse(data){
    window.setTimeout(function () {
      var interval2 = window.setInterval(function(){
        console.log('current position: ' + player.getPosition());
        if(data.realDuration<=player.getPosition()){
          window.clearInterval(interval2);
          $('.article-li').each(function (idx, item) {
            if (!$(item).hasClass('cur')) {
              console.log('GO TO NEXT COURSE...');
              $(item).click();
              return false;
            }
          });
        }
      },2000)
      
    }, data.duration* 1000 + Math.random()*1000) ;
  }

  getCurrentCourseDuration().done(function(data){
    autoClickNextCourse(data)
  });
});

$('.article-li').each(function (idx, item) {
  if (!$(item).hasClass('yes2')) {
    $(item).click();
    console.log('GO TO FIRST COURSE...');
    return false;
  }
});


