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
            $(this).data('time-start', positionTmp);
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
            draggableElement.find('.merge-time').text(mergeT);
            //alert('5');
        },
        out: function (event, ui) {        
        }
    });
  
  // назначает положение объектов
    $('.draggable').each(function () {
        var pos = ($(this).offset().left / 12); 
        $(this).data('time-start', pos);
        $(this).find('span').text(pos);
    });
    
  
    $('video, audio').each(function () {
        $(this).on('loadedmetadata', function () {
            var dur = $(this)[0].duration;
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
       // var nowPlaying;

        //$('#prewatch-button').click(function () {
        //    // video.play();
        //    nowPlaying = 0;
        //    $('video, audio').each(function (i) {
        //        var startTime = $(this).parent('li').data('time-start');
        //        mediaQueue[i] = $(this).get(0);
        //        setTimeout(function () {
        //            mediaQueue[i].play();                    
        //            if (mediaQueue[i].tagName != 'AUDIO') {
        //                draw(mediaQueue[i]);
        //            }
        //        }, startTime * 1000);
               
        //    });    
        //});

        $('#prewatch-button').click(playByTimer);
        function playByTimer()
        {
            //nowPlaying = 0;
            var startTime = [];
            var start = new Date().getTime(),
                timeCount = 0,
                real,
                offset = 0,
                dif = 0;
            
            $('video, audio').each(function (i) {

              
                startTime[i] = $(this).parent('li').data('time-start');
                mediaQueue[i] = $(this);
            });
            //startTime.sort();
            mediaQueue.sort(function (a, b) {
                if (a.parent('li').data('time-start') > b.parent('li').data('time-start'))
                    return 1;
                if (a.parent('li').data('time-start') < b.parent('li').data('time-start'))
                    return -1;
                return 0;
            });
            startTime.sort();
            //alert('1');
            var str1 = '';
            //    str2 = '';
            //startTime.forEach(function (item,i) {
            //    str1 += item + " ";
            //});
            //alert('2');
            //alert(str1);
            //mediaQueue.forEach(function (item,i) {
            //    str2 += item.parent('li').data('time-start') + " ";
            //});
            //alert(str1);
            //alert(str2);

            startTime.forEach(function (item, i) {                
                if(item == startTime[i+1])
                {
                    offset++;
                    alert(offset);
                    return;
                }
                else
                {
                    var nowPlaying = mediaQueue.filter(function (element, index) { return (index <= i && index >= i - offset);});
                    alert(nowPlaying);
                    offset = 0;
                    real = new Date().getTime();
                    dif = real - start;
                    setTimeout(function () {
                        nowPlaying.forEach(function (it) {
                            it.get(0).play();
                        });
                    }, item * 1000 - dif);
                }
            });
            
            //alert('1');
            //alert(startTime);
            //alert(arr);
            //alert(real);
            //alert(start);
            //alert(dif);
            //alert(str1);
           
            setTimeout(function () {
                mediaQueue[i].play();
                if (mediaQueue[i].tagName != 'AUDIO') {
                    draw(mediaQueue[i]);
                }
            }, startTime * 1000);
        }
        function draw(media) {
            if (media.paused || media.ended) {
                alert('end');
                context.clearRect(0, 0, canvas.width, canvas.height);
                nowPlaying--;
                return false;
            }
            if (nowPlaying > 1)
                context.globalAlpha = 0.5;
            else
                context.globalAlpha = 1;
            // $('video').each(function () {
           // if (!media.paused || !media.ended)
                context.drawImage(media, 0, 0);
            // });
                nowPlaying++;
            setTimeout(draw, 20, media);
            // context.drawImage(video, 0, 0);                 
        }
        function sortByTimeStart(a,b){
            if(a.parent('li').data('time-start') > b.parent('li').data('time-start'))
                return 1;
            if (a.parent('li').data('time-start') < b.parent('li').data('time-start'))
                return -1;
            return 0;
        }
    });    



