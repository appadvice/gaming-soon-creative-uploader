$(document).ready(function () {

  //init fast click to prevent delay on mobile devices
  $(function() {
    FastClick.attach(document.body);
  });


  //index carousel

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
    swipeStatus: swipeStatus,
    allowPageScroll: "none",
    threshold: 50
  });

  /**
   * Catch each phase of the swipe.
   * move : we drag the div.
   * cancel : we animate back to where we were
   * end : we animate to the next image
   */
  function swipeStatus(event, phase, direction, distance, fingers) {

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

  //media handling

  var posterBtn = $('#posterBtn');
  var trailerBtn = $('#trailerBtn');
  var posterWrapper = $('#posterWrapper');
  var trailerWrapper = $('#trailerWrapper');
  var darkBg = $('#darkBg');

  posterBtn.on("click", function () {
    if (posterBtn.hasClass('active') == false) {
      posterBtn.addClass('active');
      trailerBtn.removeClass('active');
      posterWrapper.addClass('active');
      trailerWrapper.removeClass('active');
      darkBg.addClass('opaque');

      var myVideo = document.getElementById("trailer");
      if (myVideo.played)
        myVideo.pause();
    }
  });

  trailerBtn.on("click", function () {
    if (trailerBtn.hasClass('active') == false) {
      trailerBtn.addClass('active');
      posterBtn.removeClass('active');
      trailerWrapper.addClass('active');
      posterWrapper.removeClass('active');
      darkBg.removeClass('opaque');

      var myVideo = document.getElementById("trailer");
      if (myVideo.paused)
        myVideo.play();
    }
  });

});
