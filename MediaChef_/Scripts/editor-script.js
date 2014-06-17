/*------------------------------------------------------------*/
/* editor-script.js                                           */
/*                                                            */
/* Логика клиентской части приложения совместной демонстрации */
/* мультимедийных файлов на странице редактора(Editor.cshtml) */
/*                                                            */
/* Автор: Зонов А.А., 2014 г.                                 */
/* -----------------------------------------------------------*/

jQuery.noConflict();                                //предотвращение межфайловых конфликтов JQuery
jQuery(document).ready(function ($) {               //запуск скрипта editor-script после загрузки страницы
    var page_w = 960;                               //размеры холста предпросмотра Canvas 
    var page_h = 768;
    var positionTmp;                                //смещение относительно левой границы окна по оси X
    var colors = ["#8A2BE2", "#6495ED", "#1E90FF",  //цвета временной шкалы
        '#90EE90', '#FF6347', '#FF00FF', '#ADFF2F',
        '#008000', '#0000FF', '#4169E1', '#FF0000'];
    
    var mediaQueue = [];                            //медиа-объекты на странице в виде экземпляра MediaQueueClass
    var canvases = [];                              //холсты предпросмотра Canvas
    var contexts = [];                              //2d-контексты Canvac
    var playingCount;                               //количество воспроизводимых в один момент времени медиафайлов
    var drawTimeOuts = [];                          //таймеры функции рисования на холстах draw()
    var ctrlPressed = false;                        //флаг зажатия кнопки Ctrl
    var pos = $('#position-div');                   //плавающая подсказка при зажатом Ctrl

    function MediaObjectClass(obj, time) {           //класс медиа-объекта
        this.obj = obj;                              //JQuery объект элемента медиафайла
        this.time = time;                            //время запуска/паузы в секундах
    }

    pos.draggable();                                //активация перетаскивания для плавающей подсказки

    $(this).on('keydown', function (e) {            //взведение флага ctrlPressed
        if (e.ctrlKey) {                            //при зажатии Ctrl
            ctrlPressed = true;
        }
     });    
    $(this).keyup(function (event) {                //сброс флага ctrlPressed          
        ctrlPressed = false;
    });

    $('video.project-item, audio.project-item, img.project-item').each(function () { //создание временной шкалы для кажого медиафайла
            var dur = 5;                
            var rand = Math.floor(Math.random() * colors.length);
            
            var newDiv = $('<div class = "time-line droppable">')
                .attr('id', "1")
                .attr('data-time', "")              //время запуска файла в секундах
                .attr('data-pause', "none")         //время паузы 
                .css({
                position: 'relative',
                bottom: '-20px',
                left: (270 - parseInt(dur * 12)) / 2 + 'px',
                background: colors[rand],
                opacity: 0.5,
                width: parseInt(dur * 12) + 'px',
                height: '50px'
            }).appendTo($(this).parent('li'));

             $('<span id = "left-span">').css({     //отображает наложение слева в секундах
                 position: 'absolute',              //(в настоящей версии не используется)
                 color: 'white',
                top: '50%',
                left: '0px'
            }).appendTo(newDiv);

             $('<span id = "right-span">').css({    //отображает наложение справа в секундах
                 position: 'absolute',              //(в настоящей версии не используется)
                 color: 'white',
                top: '50%',
                right: '0px'
            }).appendTo(newDiv);

             $('<span id = "center-span">').css({   //время запуска в секундах
                 position: 'absolute',
                 color: 'white',
                left: '33%'
             }).appendTo(newDiv);
             if ($(this)[0].tagName != 'IMG')
                 $(this).on('loadedmetadata', function () { //ожидание загрузки метаданных объектов
                     var dur = $(this)[0].duration;         //video и audio
                     newDiv.css({                           //установка длины временной шкалы
                         left: (270 - parseInt(dur * 12)) / 2 + 'px',
                         width: (parseInt(dur * 12)) + 'px'
                     });
                 });
   });

   $('.draggable').each(function () {               //инициализация времени запуска файлов
       positionTmp = ($(this).children('div.time-line:first').offset().left / 12);
       positionTmp = positionTmp.toFixed(2);
       $(this).find($('div.time-line #center-span')).text(positionTmp);
       $(this).children('div.time-line:first').attr('data-time', positionTmp);
   });

    $('.draggable').draggable({                 //присваивание новых значений времени запуска
        scroll: false,                          //при перемещении объектов на странице
        stack: '.draggable',
        drag: function () {
            positionTmp = $(this).children('div.time-line:first').offset().left / 12;
            positionTmp = positionTmp.toFixed(2);
            $(this).children('div.time-line:first').find('#center-span').text(positionTmp);
            $(this).children('div.time-line:first').attr('data-time', positionTmp);
        }
    });
                                                                    
    $("li").on('mouseenter', 'div.time-line', (function (e) {       //при наведении курсора на временную шкалу 
        if (ctrlPressed) {                                          //с зажатым Ctrl
            $(this).parent('li').draggable({ disabled: true });     //деактивация режима перемещения медиа-объекта
            $(e.target).draggable({                                 //активация режима перемещения временной шкалы по оси X
                disabled: false,                                    //присваивание новых значений времени запуска
                axis: 'x',                                          //при перемещении временной шкалы
                drag: function () {                                 //присваивание новых значений времени запуска
                    positionTmp = $(e.target).offset().left / 12;   //после паузы
                    positionTmp = positionTmp.toFixed(2);           //при перемещении части временной шкалы
                    $(e.target).attr('data-time', positionTmp);
                    $(e.target).find($('#right-span')).text(positionTmp);
                }
            });
        }
    }));

    $("li").on('mouseleave', 'div.time-line', (function (e) {   //деактивация режима перемещения временной шкалы 
        $('#position-div').fadeOut('slow');                     //активация режима перемещения медиа-объекта
        $(this).parent('li').draggable('enable');
        $(e.target).draggable({ disabled: true });
    }));

    $("li").on('mousemove','div.time-line', function(e) {           //вывод времени относительно начала медиа-объекта
        var bodyOffsets = document.body.getBoundingClientRect();    //в плавающую подсказку
        if (ctrlPressed) {                                          //в соответствии с ее положением
            var x = ((e.pageX - $(this).offset().left)/12).toFixed(2);
            pos.css({                                               //установка положения плавающей посказки
                top:  e.clientY + 30 + 'px',
                left: e.clientX + 'px'
            })
                .fadeIn('slow')
                .text(x);
        }
    });   

    $("li").on('click', 'div.time-line', (function (e) {        //обработка нажатия правой кнопки мыши
        if (ctrlPressed) {                                      //при нахождении курсора над временной шкалой
            var cutAt = $('#position-div').text();              //и зажатом Ctrl
            var rand = Math.floor(Math.random()*colors.length); 
            var newDiv = $('<div class = "time-line droppable">')
                .attr('id', $(this).parent('li').children('div.time-line').length + 1)
                .attr('data-time', "")                           //разделение временной шкалы на 2 части
                .attr('data-pause', "none")                      //добавлением новой части шкалы
                .css({                                           //присваивание времени паузы предыдущей части
                position: 'absolute',                            //и времени запуска новой
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
    
    $('#prewatch-button').click(playByTimer);   //вызов функции playByTimer() при нажатии на кнопку предпросмотра

    /*------------------------------------------------------------*/
    /* Функция:                                                   */
    /* playByTimer                                                */
    /*                                                            */
    /* Описание:                                                  */
    /* Выстраивание последовательности воспроизведения медиафайлов*/
    /* и установка таймеров их запуска и отрисовки                */
    /* Внешние эффекты:                                           */
    /* Добавление/удаление элементов Canvas в DOM                 */
    /* Воспроизведение/пауза объектов audio и video               */
    /*Отрисовка изображений объектов img на Canvas                */
    /*------------------------------------------------------------*/
        function playByTimer() {                    
            var startTime = [];     //время запуска/паузы медиафайла (вспомогательный массив)
            var timeOuts = [];      //таймерв запуска медиафайлов
            timeOuts.forEach(function (it) {    //сброс таймеров
                clearTimeout(it);
            });
            var start = new Date().getTime(),   //вычисление текущего времени для дальнейшего устранения временной погрешности
                timeCount = 0,                  //прошедшее от начала предпросмотра время с учетом погрешности
                real,                           //время, непосредственно перед установкой таймера
                dif = 0,                        //временная погрешность
                offset = 0,                     //количество одновременно запускаемых медиафайлов
                playingCount = 0,
                arrIter = 0;                    //итератор цикла заполнения очереди медиа-объектов
            //проход по всем медиа-объектам страницы
            $('video.project-item, audio.project-item, img.project-item').each(function (i) {
                var mediaEl = $(this);      //выбранный медиа-объект
                var divEl = $(this).siblings('div.time-line:first');  //первая часть временной шкала
                for (var k = 0; k < $(this).siblings('div.time-line').length; k++) { //проход по остальным частям
                    var t = divEl.attr('data-time');                    //извлечение времени запуска
                    var o = mediaEl;                                    //выбранный медиа-объект
                    startTime[arrIter] = t;                             //добавление в очередь
                    mediaQueue[arrIter] = new MediaObjectClass(o, t);
                    arrIter++;
                    var t = divEl.attr('data-pause');                   //извлечение времени паузы
                    if (t !== undefined && t !== 'none') {
                        startTime[arrIter] = t;                         //добавление в очередь
                        mediaQueue[arrIter] = new MediaObjectClass(o, t);
                        arrIter++;
                     }
                        divEl = divEl.next();                           //выбор очередного медиа-объекта
                }
            });
            mediaQueue.sort(function (a, b) {                    //сортировка по времени запуска/паузы
                if (parseFloat(a.time) > parseFloat(b.time))
                    return 1;
                if (parseFloat(a.time) < parseFloat(b.time))
                    return -1;
                return 0;
            });    
            startTime.sort(function (a, b) {                    //сортировка по времени запуска/паузы
                if (parseFloat(a) > parseFloat(b))
                    return 1;
                if (parseFloat(a) < parseFloat(b))
                    return -1;
                return 0;
            });
            mediaQueue.forEach(function (item, i) {         //проход по очереди медиа-объектов              
                if(item.time == startTime[i+1])             //группировка объектов одинаковым временем запуска
                {                                          
                    offset++;
                    return;
                }
                else                               //и извлечение их из очереди mediaQueue в массив nowPlaying    
                {
                    var nowPlaying = mediaQueue.filter(function (element, index) {
                        return (index <= i && index >= i - offset);
                    });
                    offset = 0;            
                    real = new Date().getTime();    //вычисление текущего времени
                    dif = real - start;             //временной погрешности
                    timeOuts[i] = setTimeout(function () {  //установка таймера воспроизведения 
                        var it;                             //итератор по объектам массива nowPlaying
                        for (it = 0; it < nowPlaying.length; it++) {            //проход по медиа-объектам nowPlaying
                            if (nowPlaying[it].obj[0].tagName == 'AUDIO') {     //и их запуск/пауза
                                if (nowPlaying[it].obj[0].paused)
                                    nowPlaying[it].obj[0].play();
                                else
                                    nowPlaying[it].obj[0].pause();
                                nowPlaying.splice(it--, 1);
                                timeCount += item.time * 1000;
                                    return;
                            }
                            if (nowPlaying[it].obj[0].tagName == 'VIDEO' || nowPlaying[it].obj[0].tagName == 'IMG') {                                
                                var mId = nowPlaying[it].obj.attr('id');    //добавление в DOM новых холстов предпросмотра
                                if (!canvases[mId]) {                       //для объектов img и video
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
                                if (nowPlaying[it].obj[0].tagName == 'IMG') {                   //отрисовка изображения img
                                    playingCount++;
                                    canvases[mId].fadeTo(500, (playingCount > 1) ? 0.5 : 1);   //установка прозрачности 0.5 или 1
                                    //если воспроизводится >1 или =<1 медиа-объектов                                         
                                    contexts[mId].drawImage(nowPlaying[it].obj[0], 0, 0, 960, 768); //отрисовка изображения на Canvas
                                    setTimeout(function () {        //установка таймера отмены отрисовки
                                        playingCount--;
                                        canvases[mId].detach();                                        
                                    }, 5000);
                                    nowPlaying.splice(it--, 1);
                                }
                                else 
                                    if (nowPlaying[it].obj[0].paused) {     //запуск/пауза объекта video
                                        playingCount++;
                                        nowPlaying[it].obj[0].play();
                                        canvases[mId].fadeTo(500, (playingCount > 1) ? 0.5 : 1);;
                                    }
                                    else {
                                        playingCount--;
                                        nowPlaying[it].obj[0].pause();
                                        canvases[mId].css({display: 'none'});   //скрытие холста предросмотра при паузе
                                    }                                
                            } 
                            timeCount += item.time * 1000;
                        }
                        if(nowPlaying.length!=0)
                            draw(nowPlaying);       //вызов функции отрисовки объекта video
                    }, item.time * 1000 - dif - timeCount);    //значение таймера с учетом погрешности                
                }
            });
        }
    /*------------------------------------------------------------*/
    /* Функция:                                                   */
    /* draw                                                       */
    /*                                                            */
    /* Описание:                                                  */
    /* Отрисовка изображений объектов video на Canvas каждые 20мс */
    /* Параметры:                                                 */
    /* media - массив объектов video                              */
    /* Внешние эффекты:                                           */
    /* Удаление элементов Canvas из DOM                           */
    /*------------------------------------------------------------*/
        function draw(media) {         
            if (media[0].obj[0].ended) {        //удаление элемента Canvas
                media.forEach(function (m) {    //и сброс таймера после завершения воспроизведения
                    playingCount--;
                    clearTimeout(drawTimeOuts[m.obj.attr('id')]);
                    canvases[m.obj.attr('id')].detach();                    
                    });    
                return false;
            }
            media.forEach(function (m, it) {    
                if (!m.obj[0].paused)
                    canvases[m.obj.attr('id')].fadeTo(500, (playingCount > 1) ? 0.5 : 1);
                contexts[m.obj.attr('id')].drawImage(m.obj[0], 0, 0, 960, 768); //отрисовка изображения на Canvas
                drawTimeOuts[m.obj.attr('id')] = setTimeout(draw, 20, media);   //установка таймера вызова функции draw на 20мс
            });            
        }        
    });    



