/*------------------------------------------------------------*/
/* editor-script.js                                           */
/*                                                            */
/* ������ ���������� ����� ���������� ���������� ������������ */
/* �������������� ������ �� �������� ���������(Editor.cshtml) */
/*                                                            */
/* �����: ����� �.�., 2014 �.                                 */
/* -----------------------------------------------------------*/

jQuery.noConflict();                                //�������������� ����������� ���������� JQuery
jQuery(document).ready(function ($) {               //������ ������� editor-script ����� �������� ��������
    var page_w = 960;                               //������� ������ ������������� Canvas 
    var page_h = 768;
    var positionTmp;                                //�������� ������������ ����� ������� ���� �� ��� X
    var colors = ["#8A2BE2", "#6495ED", "#1E90FF",  //����� ��������� �����
        '#90EE90', '#FF6347', '#FF00FF', '#ADFF2F',
        '#008000', '#0000FF', '#4169E1', '#FF0000'];
    
    var mediaQueue = [];                            //�����-������� �� �������� � ���� ���������� MediaQueueClass
    var canvases = [];                              //������ ������������� Canvas
    var contexts = [];                              //2d-��������� Canvac
    var playingCount;                               //���������� ��������������� � ���� ������ ������� �����������
    var drawTimeOuts = [];                          //������� ������� ��������� �� ������� draw()
    var ctrlPressed = false;                        //���� ������� ������ Ctrl
    var pos = $('#position-div');                   //��������� ��������� ��� ������� Ctrl

    function MediaObjectClass(obj, time) {           //����� �����-�������
        this.obj = obj;                              //JQuery ������ �������� ����������
        this.time = time;                            //����� �������/����� � ��������
    }

    pos.draggable();                                //��������� �������������� ��� ��������� ���������

    $(this).on('keydown', function (e) {            //��������� ����� ctrlPressed
        if (e.ctrlKey) {                            //��� ������� Ctrl
            ctrlPressed = true;
        }
     });    
    $(this).keyup(function (event) {                //����� ����� ctrlPressed          
        ctrlPressed = false;
    });

    $('video.project-item, audio.project-item, img.project-item').each(function () { //�������� ��������� ����� ��� ������ ����������
            var dur = 5;                
            var rand = Math.floor(Math.random() * colors.length);
            
            var newDiv = $('<div class = "time-line droppable">')
                .attr('id', "1")
                .attr('data-time', "")              //����� ������� ����� � ��������
                .attr('data-pause', "none")         //����� ����� 
                .css({
                position: 'relative',
                bottom: '-20px',
                left: (270 - parseInt(dur * 12)) / 2 + 'px',
                background: colors[rand],
                opacity: 0.5,
                width: parseInt(dur * 12) + 'px',
                height: '50px'
            }).appendTo($(this).parent('li'));

             $('<span id = "left-span">').css({     //���������� ��������� ����� � ��������
                 position: 'absolute',              //(� ��������� ������ �� ������������)
                 color: 'white',
                top: '50%',
                left: '0px'
            }).appendTo(newDiv);

             $('<span id = "right-span">').css({    //���������� ��������� ������ � ��������
                 position: 'absolute',              //(� ��������� ������ �� ������������)
                 color: 'white',
                top: '50%',
                right: '0px'
            }).appendTo(newDiv);

             $('<span id = "center-span">').css({   //����� ������� � ��������
                 position: 'absolute',
                 color: 'white',
                left: '33%'
             }).appendTo(newDiv);
             if ($(this)[0].tagName != 'IMG')
                 $(this).on('loadedmetadata', function () { //�������� �������� ���������� ��������
                     var dur = $(this)[0].duration;         //video � audio
                     newDiv.css({                           //��������� ����� ��������� �����
                         left: (270 - parseInt(dur * 12)) / 2 + 'px',
                         width: (parseInt(dur * 12)) + 'px'
                     });
                 });
   });

   $('.draggable').each(function () {               //������������� ������� ������� ������
       positionTmp = ($(this).children('div.time-line:first').offset().left / 12);
       positionTmp = positionTmp.toFixed(2);
       $(this).find($('div.time-line #center-span')).text(positionTmp);
       $(this).children('div.time-line:first').attr('data-time', positionTmp);
   });

    $('.draggable').draggable({                 //������������ ����� �������� ������� �������
        scroll: false,                          //��� ����������� �������� �� ��������
        stack: '.draggable',
        drag: function () {
            positionTmp = $(this).children('div.time-line:first').offset().left / 12;
            positionTmp = positionTmp.toFixed(2);
            $(this).children('div.time-line:first').find('#center-span').text(positionTmp);
            $(this).children('div.time-line:first').attr('data-time', positionTmp);
        }
    });
                                                                    
    $("li").on('mouseenter', 'div.time-line', (function (e) {       //��� ��������� ������� �� ��������� ����� 
        if (ctrlPressed) {                                          //� ������� Ctrl
            $(this).parent('li').draggable({ disabled: true });     //����������� ������ ����������� �����-�������
            $(e.target).draggable({                                 //��������� ������ ����������� ��������� ����� �� ��� X
                disabled: false,                                    //������������ ����� �������� ������� �������
                axis: 'x',                                          //��� ����������� ��������� �����
                drag: function () {                                 //������������ ����� �������� ������� �������
                    positionTmp = $(e.target).offset().left / 12;   //����� �����
                    positionTmp = positionTmp.toFixed(2);           //��� ����������� ����� ��������� �����
                    $(e.target).attr('data-time', positionTmp);
                    $(e.target).find($('#right-span')).text(positionTmp);
                }
            });
        }
    }));

    $("li").on('mouseleave', 'div.time-line', (function (e) {   //����������� ������ ����������� ��������� ����� 
        $('#position-div').fadeOut('slow');                     //��������� ������ ����������� �����-�������
        $(this).parent('li').draggable('enable');
        $(e.target).draggable({ disabled: true });
    }));

    $("li").on('mousemove','div.time-line', function(e) {           //����� ������� ������������ ������ �����-�������
        var bodyOffsets = document.body.getBoundingClientRect();    //� ��������� ���������
        if (ctrlPressed) {                                          //� ������������ � �� ����������
            var x = ((e.pageX - $(this).offset().left)/12).toFixed(2);
            pos.css({                                               //��������� ��������� ��������� ��������
                top:  e.clientY + 30 + 'px',
                left: e.clientX + 'px'
            })
                .fadeIn('slow')
                .text(x);
        }
    });   

    $("li").on('click', 'div.time-line', (function (e) {        //��������� ������� ������ ������ ����
        if (ctrlPressed) {                                      //��� ���������� ������� ��� ��������� ������
            var cutAt = $('#position-div').text();              //� ������� Ctrl
            var rand = Math.floor(Math.random()*colors.length); 
            var newDiv = $('<div class = "time-line droppable">')
                .attr('id', $(this).parent('li').children('div.time-line').length + 1)
                .attr('data-time', "")                           //���������� ��������� ����� �� 2 �����
                .attr('data-pause', "none")                      //����������� ����� ����� �����
                .css({                                           //������������ ������� ����� ���������� �����
                position: 'absolute',                            //� ������� ������� �����
                bottom: '-20px',
                left: $(this).position().left + (parseInt(cutAt * 12)) + 'px',
                background: colors[rand],
                opacity: 0.5,
                width: $(this).width() - (parseInt(cutAt * 12)) + 'px',
                height: '50px',
                'border-radius': '10px'
                })
                .appendTo($(this).parent('li'));
            $(this).css({
                width: (parseInt(cutAt * 12)) + 'px',
                'border-radius': '10px'
            });
            $('<span id = "center-span">').css({
                position: 'absolute',
                color: 'white',
                left: '33%'
            })
                .appendTo(newDiv)
            .text(cutAt);
            var td = (newDiv.offset().left / 12).toFixed(2);
            newDiv.attr('data-time', td);
            newDiv.prev('div.time-line').attr('data-pause', td);
        }
    }));
    
    $('#prewatch-button').click(playByTimer);   //����� ������� playByTimer() ��� ������� �� ������ �������������

    /*------------------------------------------------------------*/
    /* �������:                                                   */
    /* playByTimer                                                */
    /*                                                            */
    /* ��������:                                                  */
    /* ������������ ������������������ ��������������� �����������*/
    /* � ��������� �������� �� ������� � ���������                */
    /* ������� �������:                                           */
    /* ����������/�������� ��������� Canvas � DOM                 */
    /* ���������������/����� �������� audio � video               */
    /*��������� ����������� �������� img �� Canvas                */
    /*------------------------------------------------------------*/
        function playByTimer() {                    
            var startTime = [];     //����� �������/����� ���������� (��������������� ������)
            var timeOuts = [];      //������� ������� �����������
            timeOuts.forEach(function (it) {    //����� ��������
                clearTimeout(it);
            });
            var start = new Date().getTime(),   //���������� �������� ������� ��� ����������� ���������� ��������� �����������
                timeCount = 0,                  //��������� �� ������ ������������� ����� � ������ �����������
                real,                           //�����, ��������������� ����� ���������� �������
                dif = 0,                        //��������� �����������
                offset = 0,                     //���������� ������������ ����������� �����������
                playingCount = 0,
                arrIter = 0;                    //�������� ����� ���������� ������� �����-��������
            //������ �� ���� �����-�������� ��������
            $('video.project-item, audio.project-item, img.project-item').each(function (i) {
                var mediaEl = $(this);      //��������� �����-������
                var divEl = $(this).siblings('div.time-line:first');  //������ ����� ��������� �����
                for (var k = 0; k < $(this).siblings('div.time-line').length; k++) { //������ �� ��������� ������
                    var t = divEl.attr('data-time');                    //���������� ������� �������
                    var o = mediaEl;                                    //��������� �����-������
                    startTime[arrIter] = t;                             //���������� � �������
                    mediaQueue[arrIter] = new MediaObjectClass(o, t);
                    arrIter++;
                    var t = divEl.attr('data-pause');                   //���������� ������� �����
                    if (t !== undefined && t !== 'none') {
                        startTime[arrIter] = t;                         //���������� � �������
                        mediaQueue[arrIter] = new MediaObjectClass(o, t);
                        arrIter++;
                     }
                        divEl = divEl.next();                           //����� ���������� �����-�������
                }
            });
            mediaQueue.sort(function (a, b) {                    //���������� �� ������� �������/�����
                if (parseFloat(a.time) > parseFloat(b.time))
                    return 1;
                if (parseFloat(a.time) < parseFloat(b.time))
                    return -1;
                return 0;
            });    
            startTime.sort(function (a, b) {                    //���������� �� ������� �������/�����
                if (parseFloat(a) > parseFloat(b))
                    return 1;
                if (parseFloat(a) < parseFloat(b))
                    return -1;
                return 0;
            });
            mediaQueue.forEach(function (item, i) {         //������ �� ������� �����-��������              
                if(item.time == startTime[i+1])             //����������� �������� ���������� �������� �������
                {                                          
                    offset++;
                    return;
                }
                else                               //� ���������� �� �� ������� mediaQueue � ������ nowPlaying    
                {
                    var nowPlaying = mediaQueue.filter(function (element, index) {
                        return (index <= i && index >= i - offset);
                    });
                    offset = 0;            
                    real = new Date().getTime();    //���������� �������� �������
                    dif = real - start;             //��������� �����������
                    timeOuts[i] = setTimeout(function () {  //��������� ������� ��������������� 
                        var it;                             //�������� �� �������� ������� nowPlaying
                        for (it = 0; it < nowPlaying.length; it++) {            //������ �� �����-�������� nowPlaying
                            if (nowPlaying[it].obj[0].tagName == 'AUDIO') {     //� �� ������/�����
                                if (nowPlaying[it].obj[0].paused)
                                    nowPlaying[it].obj[0].play();
                                else
                                    nowPlaying[it].obj[0].pause();
                                nowPlaying.splice(it--, 1);
                                timeCount += item.time * 1000;
                                    return;
                            }
                            if (nowPlaying[it].obj[0].tagName == 'VIDEO' || nowPlaying[it].obj[0].tagName == 'IMG') {                                
                                var mId = nowPlaying[it].obj.attr('id');    //���������� � DOM ����� ������� �������������
                                if (!canvases[mId]) {                       //��� �������� img � video
                                    canvases[mId] = $('<canvas>').attr({    
                                        id: mId
                                    }).css({
                                        width: page_w + 'px',
                                        height: page_h + 'px',
                                        position: 'absolute',
                                        left: '0px'
                                    }).appendTo('#prewatch')
                                    canvases[mId][0].width = page_w;
                                    canvases[mId][0].height = page_h;
                                    contexts[mId] = canvases[mId][0].getContext('2d');
                                }
                                if (nowPlaying[it].obj[0].tagName == 'IMG') {                   //��������� ����������� img
                                    playingCount++;
                                    canvases[mId].fadeTo(500, (playingCount > 1) ? 0.5 : 1);   //��������� ������������ 0.5 ��� 1
                                    //���� ��������������� >1 ��� =<1 �����-��������                                         
                                    contexts[mId].drawImage(nowPlaying[it].obj[0], 0, 0, 960, 768); //��������� ����������� �� Canvas
                                    setTimeout(function () {        //��������� ������� ������ ���������
                                        playingCount--;
                                        canvases[mId].detach();                                        
                                    }, 5000);
                                    nowPlaying.splice(it--, 1);
                                }
                                else 
                                    if (nowPlaying[it].obj[0].paused) {     //������/����� ������� video
                                        playingCount++;
                                        nowPlaying[it].obj[0].play();
                                        canvases[mId].fadeTo(500, (playingCount > 1) ? 0.5 : 1);;
                                    }
                                    else {
                                        playingCount--;
                                        nowPlaying[it].obj[0].pause();
                                        canvases[mId].css({display: 'none'});   //������� ������ ������������ ��� �����
                                    }                                
                            } 
                            timeCount += item.time * 1000;
                        }
                        if(nowPlaying.length!=0)
                            draw(nowPlaying);       //����� ������� ��������� ������� video
                    }, item.time * 1000 - dif - timeCount);    //�������� ������� � ������ �����������                
                }
            });
        }
    /*------------------------------------------------------------*/
    /* �������:                                                   */
    /* draw                                                       */
    /*                                                            */
    /* ��������:                                                  */
    /* ��������� ����������� �������� video �� Canvas ������ 20�� */
    /* ���������:                                                 */
    /* media - ������ �������� video                              */
    /* ������� �������:                                           */
    /* �������� ��������� Canvas �� DOM                           */
    /*------------------------------------------------------------*/
        function draw(media) {         
            if (media[0].obj[0].ended) {        //�������� �������� Canvas
                media.forEach(function (m) {    //� ����� ������� ����� ���������� ���������������
                    playingCount--;
                    clearTimeout(drawTimeOuts[m.obj.attr('id')]);
                    canvases[m.obj.attr('id')].detach();                    
                    });    
                return false;
            }
            media.forEach(function (m, it) {    
                if (!m.obj[0].paused)
                    canvases[m.obj.attr('id')].fadeTo(500, (playingCount > 1) ? 0.5 : 1);
                contexts[m.obj.attr('id')].drawImage(m.obj[0], 0, 0, 960, 768); //��������� ����������� �� Canvas
                drawTimeOuts[m.obj.attr('id')] = setTimeout(draw, 20, media);   //��������� ������� ������ ������� draw �� 20��
            });            
        }        
    });    



