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
    var colors = ["#8A2BE2", "#6495ED", "#1E90FF", '#90EE90', '#FF6347', '#FF00FF', '#ADFF2F', '#008000', '#0000FF', '#4169E1', '#FF0000'];
    //var mouseX;
    //var mouseY;  

    var mediaQueue = [];
    var canvases = [];
    var contexts = [];
    var playingCount;
    var drawTimeOuts = [];
    var pressed = false;

    canvas[0].width = page_w;
    canvas[0].height = page_h;
    canvas.css("width", page_w);
    canvas.css("height", page_h);

    $(this).on('keydown', function (e) {
        if (e.ctrlKey) {
            pressed = true;
        }
        });    
    $(this).keyup(function (event) {
        pressed = false;
    });
    //$(this).mousemove(function (e) {
    //    mouseX = e.pageX;
    //    mouseY = e.pageY;
    //});

    $('video, audio').each(function () {
        $(this).on('loadedmetadata', function () {
            var dur = $(this)[0].duration;
            $(this).parent('li').attr('data-time-end', dur);           
            var rand = Math.floor(Math.random() * colors.length);
            
            var newDiv = $('<div class = "time-line droppable">').css({
                position: 'relative',
                bottom: '-20px',
                left: (270 - parseInt(dur * 12)) / 2 + 'px',
                background: colors[rand],
                opacity: 0.5,
                width: parseInt(dur * 12) + 'px',
                height: '50px'
            }).appendTo($(this).parent('li'));

             $('<span id = "left-span">').css({
                 position: 'absolute',
                 color: 'white',
                top: '50%',
                left: '0px'
            }).appendTo(newDiv);

             $('<span id = "right-span">').css({
                 position: 'absolute',
                 color: 'white',
                top: '50%',
                right: '0px'
            }).appendTo(newDiv);

             $('<span id = "center-span">').css({
                 position: 'absolute',
                 color: 'white',
                left: '33%'
             }).appendTo(newDiv);

             //newDiv.mousemove(function(){
             //    $('#position-div').css({
             //        top: mouseY + 'px',
             //        left: mouseX + 'px'
             //    }).fadeIn('slow');
             });   
    });

    $('.draggable').each(function () {
        positionTmp = ($(this).offset().left / 12);
        positionTmp = positionTmp.toFixed(2);
        $(this).attr('data-time-start', positionTmp);
        $(this).find($('div #center-span')).text(positionTmp);
    });

    $('.draggable').draggable({
        scroll: false,
        stack: '.draggable',
        drag: function () {
            positionTmp = $(this).offset().left / 12;
            positionTmp = positionTmp.toFixed(2);
            $(this).attr('data-time-start', positionTmp);
            $(this).find($('div #center-span')).text(positionTmp);
        }
    });

    //var asd = 0;
    //$('.droppable').droppable({
    //    over: function(event, ui)
    //    {
    //        console.log(asd++);
    //    }
    //    //drop: function (event, ui) {

    //    //},
    //    //over: function (event, ui) {
    //    //    var draggableElement = ui.draggable;                     
    //    //    var mergeT;            

    //    //    if (draggableElement.data('time-start') > $(this).data('time-start')) {
    //    //        //alert('1');
    //    //        mergeT = $(this).data('time-end') * 12 + $(this).data('time-start') - draggableElement.data('time-start');
    //    //       // alert('2');
    //    //    }
    //    //    else {
    //    //       // alert('3');
    //    //        mergeT = draggableElement.data('time-end') * 12 + draggableElement.data('time-start') - $(this).data('time-start');
    //    //       // alert('4');
    //    //    }
    //    //    draggableElement.find('.merge-time').text(mergeT);
    //    //    //alert('5');
    //    //},
    //    //out: function (event, ui) {        
    //    //}
    //});

    //$('li').tooltip({
    //    content: "<p>dasdad</p>",
    //    track: true

    //});
    var pos = $('#position-div');
    pos.draggable();
    $("li").on('mousemove','div.time-line', function(e) {
        var bodyOffsets = document.body.getBoundingClientRect();
        if (pressed) {
            var x = ((e.pageX - $(this).offset().left)/12).toFixed(2);
            pos.css({
                top:  e.clientY + 30 + 'px',
                left: e.clientX + 'px'
            }).fadeIn('slow').text(x);
        }
    });

    $("li").on('mouseout', 'div.time-line', (function () {
        $('#position-div').fadeOut('slow');
    }));

    $("li").on('click', 'div.time-line', (function () {

        $('#position-div').fadeOut('slow');
    }));


    //$('li').click(function (e) {
    //    event.preventDefault();
    //  //  if(e.target == )
    //     console.log('nee');
    //    if (e.ctrlKey)
    //        console.log('aga');
    //});

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
            
            $('video.project-item, audio.project-item, img.project-item').each(function (i) {
                startTime[i] = $(this).parent('li').attr('data-time-start');                
                mediaQueue[i] = $(this);
            });           
            console.log(startTime);
            mediaQueue.sort(function (a, b) {
                if (a.parent('li').attr('data-time-start') > b.parent('li').attr('data-time-start'))
                    return 1;
                if (a.parent('li').attr('data-time-start') < b.parent('li').attr('data-time-start'))
                    return -1;
                return 0;
            });
            startTime.sort();
            console.log(startTime);
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
                        var it;
                        for (it = 0; it < nowPlaying.length; it++) {
                            if (nowPlaying[it][0].tagName == 'AUDIO') {
                                nowPlaying[it][0].play();
                                nowPlaying.splice(it--, 1);
                            }
                            if (nowPlaying[it][0].tagName == 'VIDEO' || nowPlaying[it][0].tagName == 'IMG') {
                                playingCount++;
                                var mId = nowPlaying[it].attr('id');

                                $('<canvas>').attr({
                                    id: mId
                                }).css({
                                    width: page_w + 'px',
                                    height: page_h + 'px',
                                    position: 'absolute',
                                    left: '0px'
                                }).appendTo('#prewatch')

                                canvases[mId] = $("canvas[id=" + mId + "]");
                                canvases[mId][0].width = page_w;
                                canvases[mId][0].height = page_h;
                                contexts[mId] = canvases[mId][0].getContext('2d');
                                console.log("1" + nowPlaying);
                                if (nowPlaying[it][0].tagName == 'IMG') {
                                    canvases[mId].fadeTo(500, (playingCount > 1) ? 0.5 : 1);
                                    contexts[mId].drawImage(nowPlaying[it][0], 0, 0, 960, 768);
                                    setTimeout(function () {
                                        canvases[mId].detach();
                                        playingCount--;
                                    },5000);
                                    nowPlaying.splice(it--, 1);
                                }
                                else
                                    nowPlaying[it][0].play();
                            } 
                            timeCount += item * 1000;
                        }
                        console.log("2" + nowPlaying);
                        if(nowPlaying.length!=0)
                            draw(nowPlaying);
                    }, item * 1000 - dif - timeCount);                    
                }
            });
        }
            
        function draw(media) {         
            if (media[0][0].paused || media[0][0].ended) {
                media.forEach(function (m) {
                    clearTimeout(drawTimeOuts[m.attr('id')]);
                    canvases[m.attr('id')].detach();
                    playingCount--;
                    });    
                return false;
            }
            media.forEach(function (m, it) {
                console.log(playingCount);
                canvases[m.attr('id')].fadeTo(500, (playingCount > 1) ? 0.5 : 1);
                contexts[m.attr('id')].drawImage(m[0], 0, 0, 960, 768);            
                drawTimeOuts[m.attr('id')] = setTimeout(draw, 20, media);
            });            
        }        
    });    



