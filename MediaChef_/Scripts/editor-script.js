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

    //$('.droppable').droppable({
    //    drop: function (event, ui) {
         
    //    },
    //    over: function (event, ui) {
    //        var draggableElement = ui.draggable;                     
    //        var mergeT;            
          
    //        if (draggableElement.data('time-start') > $(this).data('time-start')) {
    //            //alert('1');
    //            mergeT = $(this).data('time-end') * 12 + $(this).data('time-start') - draggableElement.data('time-start');
    //           // alert('2');
    //        }
    //        else {
    //           // alert('3');
    //            mergeT = draggableElement.data('time-end') * 12 + draggableElement.data('time-start') - $(this).data('time-start');
    //           // alert('4');
    //        }
    //        draggableElement.find('.merge-time').text(mergeT);
    //        //alert('5');
    //    },
    //    out: function (event, ui) {        
    //    }
    //});
  
  // назначает положение объектов
    $('.draggable').each(function () {
        positionTmp = ($(this).offset().left / 12);
        $(this).attr('data-time-start', positionTmp);
        $(this).find('span').text(positionTmp);
    });   
  
    $('video, audio').each(function () {
        $(this).on('loadedmetadata', function () {
            var dur = $(this)[0].duration;
            $(this).parent('li').attr('data-time-end', dur);
           // $(this).parent('li').width(parseInt(dur*12));
            });            
    }); 
        canvas[0].width = page_w;
        canvas[0].height = page_h;  
      
        var mediaQueue = [];
        var playingCount;

        $('#prewatch-button').click(playByTimer);

        function playByTimer() {
            var startTime = [];
            var timeOuts = [];
            timeOuts.forEach(function (it) {
                clearTimeout(it);
            });
            var start = new Date().getTime(),
                timeCount = 0,
                real,
                offset = 0,
                dif = 0;
            playingCount = 0;
            
            $('video, audio, img').each(function (i) {
                startTime[i] = $(this).parent('li').attr('data-time-start');
                mediaQueue[i] = $(this);
            });

            mediaQueue.sort(function (a, b) {
                if (a.parent('li').attr('data-time-start') > b.parent('li').attr('data-time-start'))
                    return 1;
                if (a.parent('li').attr('data-time-start') < b.parent('li').attr('data-time-start'))
                    return -1;
                return 0;
            });
            startTime.sort();            

            startTime.forEach(function (item, i) {                
                if(item == startTime[i+1])
                {
                    offset++;
                    return;
                }
                else
                {
                    var nowPlaying = mediaQueue.filter(function (element, index) {
                        return (index <= i && index >= i - offset);
                    });
                    offset = 0;            
                    real = new Date().getTime();
                    dif = real - start;

                    timeOuts[i] = setTimeout(function () {
                        nowPlaying.forEach(function (it) {
                            it.get(0).play();
                            playingCount++;
                            context.globalAlpha = (playingCount > 1) ? 0.5 : 1;
                           // if()
                            draw(nowPlaying);
                            $('#test').text("it  " + item * 1000 + "dif  " + dif + "time   " + timeCount);
                            timeCount += item * 1000;
                        });
                    }, item * 1000 - dif - timeCount);                    
                }
            });
        }
        var drawTimeOuts = [];       
        function draw(media) {
            media.forEach(function(m){
                m.get(0).addEventListener('ended', function () {
                    clearTimeout(drawTimeOuts[m.parent('li').attr('data-time-start')]);
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    playingCount--;
                    context.globalAlpha = (playingCount > 1) ? 0.5 : 1;
                });
            });
            
            media.forEach(function (m, it) {
                context.drawImage(m[0], 0, 0);
                $('#test').text(" media  " + m + "count  " + playingCount );
                drawTimeOuts[m.parent('li').attr('data-time-start')] = setTimeout(draw, 20, media);
            });            
        }        
    });    



