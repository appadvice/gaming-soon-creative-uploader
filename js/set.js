//init fast click to prevent delay on mobile devices
$(function () {
  FastClick.attach(document.body);
});

// open/close social bar
$('#shareBtn').on('click', function () {
  var socialBar = $("#socialBar");
  if (socialBar.hasClass("closed")) {
    socialBar.removeClass("closed");
  } else {
    socialBar.addClass("closed");
  }
});

// trailer video

var isMobile = (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent);

var playBtn = $('#playBtn');
var trailerWrapper = $('#trailerWrapper');
var darkBg = $('#darkBg');

playBtn.on('click', function () {
  trailer("play");
});

trailerWrapper.on('click', function () {
  trailer("pause");
});

// play/stop trailer
function trailer(action) {
  if (action == "play") {
    playBtn.addClass("active");
    trailerWrapper.addClass("active");
    darkBg.removeClass("opaque");
    if (!isMobile) {
      player.playVideo();
    }
  } else if (action == "pause") {
    playBtn.removeClass("active");
    trailerWrapper.removeClass("active");
    darkBg.addClass("opaque");
    player.pauseVideo();
  } else if (action == "stop") {
    playBtn.removeClass("active");
    trailerWrapper.removeClass("active");
    darkBg.addClass("opaque");
    setTimeout(function(){
      player.destroy();
      onYouTubeIframeAPIReady();
    },500)
  }
}

//
// youtube API
//

// 1. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('trailer', {
    height: '390',
    width: '640',
    playerVars: { 'autohide': 1, 'rel': 0, 'loop': 1 },
    videoId: 'vkGS203qCg8',
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

// 3. The API calls this function when the player's state changes.
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    trailer("stop");
  }
}