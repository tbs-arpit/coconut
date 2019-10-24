(function ($) {
    $.fn.coconut = function (options) {
        var settings = $.extend({
            colors: [
                '#001f3f',
                '#c7d1d9',
                '#c7d1d9',
                '#b58484'
            ],
            thickness: 1.15,
            values: []
        }, options);

        if (settings.thickness <= 1) {
            console.warn("%c 🚨thickness should be more than 1", "font-size:x-large");
            return;
        }

        if (this.length < 1) {
            console.warn("%c 🚨There is no such element", "font-size:x-large");
            return;
        }

        if (settings.values.length == 0) {
            console.warn("%c 🚨Please provide values object in config.", "font-size:x-large");
            return;
        }

        if (settings.values.length > 2) {
            console.warn("%c 🚨More than two objects are not supported", "font-size:x-large");
            return;
        }



        return this.each(function () {

            if ($(this).height() <= 0) {
                console.warn("%c 🚨Div doesn't have height", "font-size:x-large");
            }
            if ($(this).width() <= 0) {
                console.warn("%c 🚨Div doesn't have width", "font-size:x-large");
            }

            //create a canvas inside a div with same height and width
            var canvas = $("<canvas height=" + $(this).height() + " width=" + $(this).width() + " />");
            $(this).append(canvas);
            var centerDiv = $("<div />");
            centerDiv.addClass("coconut-image");
            if (settings.centerIconSrc) {
                var image = $("<img src=" + settings.centerIconSrc + " width=" + $(this).width() / 4 + " />");
                centerDiv.append(image);
            }
            if (settings.centerValue) {
                var span = $("<span/>");
                span.html(settings.centerValue);
                centerDiv.append(span);
            }
            $(this).append(centerDiv);




            var segments = settings.values;

            var canvasWidth = $(this).width();
            var canvasHeight = $(this).height();
            var xCenter = Math.floor(canvasWidth / 2);
            var yCenter = Math.floor(canvasHeight / 2);
            var radius = Math.ceil(0.8 * Math.min(xCenter, yCenter));
            var devideBy = settings.thickness;
            //console.log(radius, devideBy, Math.ceil(radius / devideBy))
            var innerRadius = Math.ceil(radius / devideBy);
            var ctx = canvas[0].getContext('2d');

            //Reset the canvas
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.restore();
            ctx.save();


            var i, total = 200;

            // for (i = 0; i < segments.length; i++) {
            //     total = total + parseFloat(segments[i].amount);
            // }

            settings.values.splice(1, 0, {
                amount: 100 - settings.values[0].amount,
                color: "#c7d1d9"
            })
            settings.values.splice(2, 0, {
                amount: 100 - settings.values[2].amount,
                color: "#c7d1d9"
            })


            var percentByDegree = 360 / total,
                degToRad = Math.PI / 180,
                currentAngle = 0,
                startAngle = 0,
                endAngle;

            ctx.translate(xCenter, yCenter);
            //Turn the chart around so the segments start from 12 o'clock
            ctx.rotate(90 * degToRad);

            for (i = 0; i < segments.length; i++) {
                startAngle = currentAngle * degToRad;
                endAngle = (currentAngle + (segments[i].amount * percentByDegree)) * degToRad;

                //Draw the segments
                ctx.fillStyle = segments[i].color;
                console.log(settings.colors[i % settings.colors.length]);

                ctx.beginPath();
                ctx.arc(0, 0, radius, startAngle, endAngle, false);
                ctx.arc(0, 0, innerRadius, endAngle, startAngle, true);
                ctx.closePath();
                ctx.fill();

                currentAngle = currentAngle + (segments[i].amount * percentByDegree);
            }
        });
    };
}(jQuery));
