$(document).ready(function() {

  // click on play
  $(".play-btn").bind("click touchstart", function() {
    openVideo();
  });

  // click on close
  $(".close-btn").bind("click touchstart", function() {
    closeVideo();
  });

  // close the video if the trailer ends
  document.getElementById("video2").addEventListener("ended", trailerHandler, false);
  function trailerHandler(e) {
    if (!e) {
      e = window.event;
    }
    closeVideo()
  }

  // replay the poster if it ends
  document.getElementById("video1").addEventListener("ended", posterHandler, false);
  function posterHandler(e) {
    if (!e) {
      e = window.event;
    }
    playPoster()
  }

  // open the trailer
  function openVideo() {
    $(".play-btn").addClass("animate-out");
    $(".poster-wrapper").addClass("go-out");
    $(".video-wrapper").removeClass("hidden");
    $(".dark-bg").removeClass("opaque");

    var myVideo = document.getElementById("video2");
    if (myVideo.paused)
      myVideo.play();
  }

  // close the trailer
  function closeVideo() {
    $(".play-btn").removeClass("animate-out");
    $(".poster-wrapper").removeClass("go-out");
    $(".video-wrapper").addClass("hidden");
    $(".dark-bg").addClass("opaque");

    var myVideo = document.getElementById("video2");
    if (myVideo.played)
      myVideo.pause();
  }

  // play the poster
  function playPoster() {
    var myVideo = document.getElementById("video1");
    if (myVideo.paused)
      myVideo.play();
  }

});
