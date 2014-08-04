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

var playBtn = $('#playBtn');
var trailerWrapper = $('#trailerWrapper');
var darkBg = $('#darkBg');

playBtn.on('click', function () {
  trailer("play");
});

trailerWrapper.on('click', function () {
  trailer("stop");
});

// play/stop trailer
function trailer(action) {
  if (action == "play") {
    playBtn.addClass("active");
    trailerWrapper.addClass("active");
    darkBg.removeClass("opaque");
    player.playVideo();
  } else if (action == "stop") {
    playBtn.removeClass("active");
    trailerWrapper.removeClass("active");
    darkBg.addClass("opaque");
    player.stopVideo();
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
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

// 3. The API calls this function when the player's state changes.
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    trailer("stop");
    player.seekTo(0);
  }
}