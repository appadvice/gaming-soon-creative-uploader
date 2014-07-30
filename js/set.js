$(document).ready(function () {

  //init fast click to prevent delay on mobile devices
  $(function() {
    FastClick.attach(document.body);
  });


  //
  //index carousel
  //

  var panel = $('.index-carousel-panel');
  var element = $('.index-carousel-element');

  var elemWidth = element.width();
  var elemFullWidth = $('.index-carousel-element:nth-child(2)').outerWidth(true);
  var elemNum = element.length;
  var windowWidth;
  var maxElements;
  var elemMargin;

  var nextBtn = $('.index-carousel-nav.next');
  var prevBtn = $('.index-carousel-nav.prev');

  var moveDistance;
  var moved = 0;
  var duration = 200;

  carousel();

  function carousel() {

    windowWidth = $(window).width();
    maxElements = Math.floor(windowWidth / elemFullWidth);
    elemMargin = Math.round((windowWidth - (maxElements * elemWidth)) / (maxElements + 1));

    while (windowWidth > ((maxElements * elemWidth) + ((maxElements + 1) * elemMargin))) {
      elemMargin++;
    }

    element.css({ marginLeft: elemMargin });

    moveDistance = elemWidth + elemMargin;

    hideBtns()

  }

  $(window).resize(function () {
    carousel();
    refreshPosition()
  });

  //Init touch swipe
  panel.swipe({
    triggerOnTouchEnd: true,
    swipeStatus: swipeStatusIndexCarousel,
    threshold: 50
  });

  // Catch each phase of the swipe
  function swipeStatusIndexCarousel(event, phase, direction, distance, fingers) {

    //If we are moving before swipe, and we are going L or R, then manually drag the images
    if (phase == "move" && (direction == "left" || direction == "right")) {

      if (direction == "left" && moved != elemNum - maxElements)
        dragPanel(-distance)

      else if (direction == "right" && moved != 0)
        dragPanel(distance)

    } else if (phase == "cancel") {
      refreshPosition()

    } else if (phase == "end") {

      if (direction == "right")
        movePrev(distance)

      else if (direction == "left")
        moveNext(distance)
    }
  }

  nextBtn.on("click", function () {
    moveNext();
  });

  prevBtn.on("click", function () {
    movePrev();
  });

  function moveNext(distance) {

    if (distance) {
      moved = moved + Math.ceil(distance / elemWidth);
    } else {
      moved = moved + 1;
    }

    if (moved <= elemNum - maxElements) {
      var value = moved * -moveDistance;
      panel.css({
        "-webkit-transition-duration" : (duration/1000).toFixed(1) + "s",
        "transition-duration" : (duration/1000).toFixed(1) + "s",
        "-webkit-transform": "translate3d(" + value + "px,0,0)",
        "-ms-transform": "translate3d(" + value + "px,0,0)",
        "transform": "translate3d(" + value + "px,0,0)"
      });
    } else {
      moved = elemNum - maxElements;
      refreshPosition()
    }

    hideBtns()
  }

  function movePrev(distance) {

    if (distance) {
      moved = moved - Math.ceil(distance / elemWidth);
    } else {
      moved = moved - 1;
    }

    if (moved >= 0) {
      var value = moved * -moveDistance;
      panel.css({
        "-webkit-transition-duration" : (duration/1000).toFixed(1) + "s",
        "transition-duration" : (duration/1000).toFixed(1) + "s",
        "-webkit-transform": "translate3d(" + value + "px,0,0)",
        "-ms-transform": "translate3d(" + value + "px,0,0)",
        "transform": "translate3d(" + value + "px,0,0)"
      });
    } else {
      moved = 0;
      refreshPosition()
    }

    hideBtns()
  }

  function refreshPosition() {
    var value = moved * -moveDistance;
    panel.css({
      "-webkit-transition-duration" : (duration/1000).toFixed(1) + "s",
      "transition-duration" : (duration/1000).toFixed(1) + "s",
      "-webkit-transform": "translate3d(" + value + "px,0,0)",
      "-ms-transform": "translate3d(" + value + "px,0,0)",
      "transform": "translate3d(" + value + "px,0,0)"
    });
  }

  function dragPanel(distance) {
    var value = moved * -moveDistance + distance;
    panel.css({
      "-webkit-transition-duration" : "0s",
      "transition-duration" : "0s",
      "-webkit-transform": "translate3d(" + value + "px,0,0)",
      "-ms-transform": "translate3d(" + value + "px,0,0)",
      "transform": "translate3d(" + value + "px,0,0)"
    });
  }

  function hideBtns() {
    if (moved == 0) {
      prevBtn.addClass("hidden")
    } else if (moved == elemNum - maxElements) {
      nextBtn.addClass("hidden")
    } else {
      prevBtn.removeClass("hidden");
      nextBtn.removeClass("hidden");
    }
  }

  
  //
  //media handling
  //

  var mediaBtns = $('.media-menu-element');
  var mediaElements = $('.media-wrapper');
  var mediaCount = mediaBtns.length;
  var darkBg = $('#darkBg');
  var trailerVideo = document.getElementById("trailer");
  var playBtn = $('#playBtn');

  if (mediaCount != mediaElements.length) {
    alert("The number of media buttons are not match the number of media wrappers!")
  }

  // trigger click on play button
  playBtn.on("click", function(){
    var i;
    for (i = 0; i < mediaCount; ++i) {
      if (mediaBtns.eq(i).hasClass("start-trailer")) {
        mediaBtns.eq(i).trigger("click");
      }
    }
  });

  mediaBtns.on("click", function(){
    var clicked = $(this);
    var index = clicked.index();

    // add active class to the actual button, removing from the other
    var i;
    for (i = 0; i < mediaCount; ++i) {
      if (mediaBtns.eq(i).hasClass("active")) {
        mediaBtns.removeClass("active");
      }
    }
    mediaBtns.eq(index).addClass("active");

    // add active class to the matching media-wrapper, removing from the other
    var j;
    for (j = 0; j < mediaCount; ++j) {
      if (mediaElements.eq(j).hasClass("active")) {
        mediaElements.removeClass("active");
      }
    }
    mediaElements.eq(index).addClass("active");

    // add bg if needed
    if (clicked.hasClass("need-bg") && darkBg.hasClass("opaque")) {
      darkBg.removeClass("opaque");
    } else if (!clicked.hasClass("need-bg") && !darkBg.hasClass("opaque")) {
      darkBg.addClass("opaque");
    }

    // start trailer if needed
    if (clicked.hasClass("start-trailer")) {
      startTrailer();
    } else if (!clicked.hasClass("start-trailer")) {
      stopTrailer();
    }

    // start game play if needed
    if (clicked.hasClass("start-game-play")) {
      playGamePlayVideo("play", gamePlayMoved);
    } else if (!clicked.hasClass("start-game-play")) {
      playGamePlayVideo("stop");
    }
  });

  function startTrailer() {
    if (trailerVideo.paused) {
      trailerVideo.play();
    }
  }

  function stopTrailer() {
    if (trailerVideo.played) {
      trailerVideo.pause();
    }
  }


  //
  // gameplay carousel
  //

  var gamePlayPrev = $('#gamePlayPrev');
  var gamePlayNext = $('#gamePlayNext');
  var gamePlayPanel = $('.game-play-panel');
  var gamePlayElement = $('.game-play-element');
  var gamePlayCount = gamePlayElement.length;
  var gamePlayElementWidth = gamePlayElement.outerWidth(true);
  var gamePlayVideos = $('.game-play-video');
  var gamePlayMoved = 0;
  var gamePlayDuration = 500;

  if (gamePlayCount != gamePlayVideos.length) {
    alert("The number of game play videos are not match the number of game play elements!")
  }

  gamePlayPrev.on("click", function(){
    gamePlayGoPrev()
  });

  gamePlayNext.on("click", function(){
    gamePlayGoNext()
  });

  //Init touch swipe
  gamePlayPanel.swipe({
    triggerOnTouchEnd: true,
    swipeStatus: swipeStatusGamePlay,
    threshold: 50
  });

  // Catch each phase of the swipe
  function swipeStatusGamePlay(event, phase, direction, distance, fingers) {

    //If we are moving before swipe, and we are going L or R, then manually drag the images
    if (phase == "move" && (direction == "left" || direction == "right")) {

      if (direction == "left" && gamePlayMoved < gamePlayCount - 1)
        moveGamePlayPanel(gamePlayMoved, -distance, 0)

      else if (direction == "right" && gamePlayMoved > 0)
        moveGamePlayPanel(gamePlayMoved, distance, 0)

    } else if (phase == "cancel") {
      moveGamePlayPanel(gamePlayMoved, 0, gamePlayDuration)

    } else if (phase == "end") {

      if (direction == "right") {
        gamePlayGoPrev()

      }  else if (direction == "left") {
        gamePlayGoNext()
      }
    }
  }

  function gamePlayGoPrev() {
    if (gamePlayMoved > 0) {
      gamePlayMoved = gamePlayMoved - 1;
    }
    moveGamePlayPanel(gamePlayMoved, 0, gamePlayDuration)
  }

  function gamePlayGoNext() {
    if (gamePlayMoved < gamePlayCount - 1) {
      gamePlayMoved = gamePlayMoved + 1;
    }
    moveGamePlayPanel(gamePlayMoved, 0, gamePlayDuration)
  }

  function moveGamePlayPanel(index, distance, duration) {
    var value = index * -gamePlayElementWidth - index * 3 + distance;
    gamePlayPanel.css({
      "-webkit-transition-duration" : (duration/1000).toFixed(1) + "s",
      "transition-duration" : (duration/1000).toFixed(1) + "s",
      "-webkit-transform": "translate3d(" + value + "px,0,0)",
      "-ms-transform": "translate3d(" + value + "px,0,0)",
      "transform": "translate3d(" + value + "px,0,0)"
    });
    gamePlayElement.removeClass("active");
    gamePlayElement.eq(index).addClass("active");
    playGamePlayVideo("play", index)
  }

  function playGamePlayVideo(status, index) {
    var i;
    for (i = 0; i < gamePlayCount; ++i) {
      if (gamePlayVideos[i].played) {
        gamePlayVideos[i].pause();
        gamePlayVideos[i].currentTime = 0;
      }
    }
    if (status == "play") {
      gamePlayVideos[index].play();
    }
  }

});