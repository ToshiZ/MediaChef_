jQuery.noConflict();
jQuery(document).ready(function ($) {    
    var video = $('video').get(0);
    var canvas = $("#canvas-prewatch");
    var context = canvas[0].getContext('2d');
    var wpage_h = $(window).height()*0.5;
    var wpage_w = $(window).width()* 0.5;
    var page_w = 960;
    var page_h = 768;
    var positionTmp;

    $('.draggable').draggable({
        containment: "#con",
        scroll: false,
        stack: '.draggable',
        drag: function () {
            positionTmp = $(this).offset().left/12;
            $(this).attr('data-time-start', positionTmp);
            $(this).find('.time-counter').text(positionTmp);
        }
    });

    $('.droppable').droppable({
        drop: function (event, ui) {
         
        },
        over: function (event, ui) {
            var draggableElement = ui.draggable;                     
            var mergeT;            
          
            if (draggableElement.data('time-start') > $(this).data('time-start')) {
                //alert('1');
                mergeT = $(this).data('time-end') * 12 + $(this).data('time-start') - draggableElement.data('time-start');
               // alert('2');
            }
            else {
               // alert('3');
                mergeT = draggableElement.data('time-end') * 12 + draggableElement.data('time-start') - $(this).data('time-start');
               // alert('4');
            }
            draggableElement.find('.merge-time').text(mergeT.toFixed(2));
            //alert('5');
        },
        out: function (event, ui) {        
        }
    });
  
  // назначает положение объектов
    $('.draggable').each(function () {
        var pos = ($(this).offset().left / 12).toFixed(3); 
        $(this).attr('data-time-start', pos);
        $(this).find('span').text(pos);
    });
    
  
    $('video, audio').each(function () {
        $(this).on('loadedmetadata', function () {
            var dur = $(this)[0].duration.toFixed(3);
            $(this).parent('li').attr('data-time-end', dur);

            $(this).parent('li').width(parseInt(dur*12));
            });            
    }); 

        canvas[0].width = page_w;
        canvas[0].height = page_h;  
        
       /* $('#prewatch-button').click( function () {           
           // video.play();
            $('video').each(function () {
                $(this).get(0).play();
            });
            //var timers = [];
            //$('video').each( function (i) {
            //    var tm = $(this).parent('li').data('time-start');                
            //    timers[i] = setTimeout(function () { $(this).get(0).play(); }, tm*1000);
            //    var d = draw();
            //    var loop = setInterval(draw, 20);
            //   });
            var d = draw();
           // var loop = setInterval(draw, 20);

        });        
        function draw() {                      
            if (video.paused || video.ended) return false;
            context.globalAlpha = 0.5;
            $('video').each(function () {
                context.drawImage($(this)[0], 0, 0);
            });
            setTimeout(draw, 20);
           // context.drawImage(video, 0, 0);                 
        }    */
        var mediaQueue = [];

        $('#prewatch-button').click(function () {
            // video.play();
           
            $('video, audio').each(function (i) {
                var tm = $(this).parent('li').data('time-start');
                mediaQueue[i] = $(this).get(0);
                setTimeout(function () { mediaQueue[i].play(); }, tm * 1000);
                if (mediaQueue[i].tagName != 'AUDIO') {                   
                    draw(mediaQueue[i]);
                }
            });    
        });

        function draw(media) {
           // if (media.paused || media.ended) return false;
            context.globalAlpha = 0.5;
            // $('video').each(function () {
           // if (!media.paused || !media.ended)
                context.drawImage(media, 0, 0);
           // });
            setTimeout(draw, 20, 'media');
            // context.drawImage(video, 0, 0);                 
        }
    });    



