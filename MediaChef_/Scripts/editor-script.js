jQuery.noConflict();
jQuery(document).ready(function ($) {
    ////$('.draggable').height(function () { return $('#con').height() * 0.1 });
    var video = $('video').get(0);
    var canvas = $("#canvas-prewatch");
    var context = canvas[0].getContext('2d');
    var page_h = $(window).height();
    var page_w = $(window).width();
    var positionTmp;

    $('.draggable').draggable({
        containment: "#con",
        scroll: false,
        stack: '.draggable',
        drag: function () {
            positionTmp = $(this).offset().left;
            $(this).attr('time-start', positionTmp);
            $(this).find('span').text(positionTmp);
        }
    });
  // назначает положение объектов
    $('.draggable').each(function () {
        var pos = $(this).offset().left;
        $(this).attr('time-start', pos);
        $(this).find('span').text(pos);
    });
    //var myVideoPlayer = document.getElementById('video_player');
   // myVideoPlayer.addEventListener('loadedmetadata', function () {
        //console.log(videoPlayer.duration);
   // });
    //$('.draggable.video, .draggable.design').each(function () {
        //var dur = $(this)[0].duration;
        //alert(dur);
        //alert(parseInt($(this).get(0).duration));


   // });


               
        $("#canvas").css('width', page_w).css('height', page_h);
        canvas[0].width = page_w;
        canvas[0].height = page_h;      
        context.fillRect(10, 20, 150, 100);
        
        $('#prewatch-button').click( function () {           
            video.play();
            var d = draw();
            var loop = setInterval(draw, 20);

        });        
        function draw() {                      
            if (video.paused || video.ended) return false;
            context.drawImage(video, 0, 0);
                 
        }
        

    });



