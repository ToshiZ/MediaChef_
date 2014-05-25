jQuery.noConflict();
jQuery(document).ready(function ($) {
        ////$('.draggable').height(function () { return $('#con').height() * 0.1 });
       $('.draggable').draggable({ containment: "#con", scroll: false });

        var video = $('video').get(0);        
        var canvas = $("#canvas-prewatch");
        
        var context = canvas[0].getContext('2d');
        
        

        $("#canvas").css('width', '300').css('height', '200');

        var cw = Math.floor(canvas.clientWidth);
        var ch = Math.floor(canvas.clientHeight);
        canvas[0].width = 300;
        canvas[0].height = 200;
        //if (canvas[0].getContext('2d')) { alert('1'); }
        context.fillRect(10, 20, 150, 100);
        
        //alert('1123');
        

        $('#prewatch-button').click( function () {           
            video.play();
            var d = draw();
            var loop = setInterval(draw, 30);

        });
        function draw() {
            if (video.paused || video.ended) return false;
            context.drawImage(video, 0, 0, 300, 200);        
                 
        }       

    });



