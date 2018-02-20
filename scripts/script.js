var can = document.getElementById("can");
var ctx = can.getContext('2d');
var timer = 0;
function resize() {
    can.width = window.innerWidth;
    can.height = window.innerHeight;
    clearTimeout(timer);
    timer = setTimeout(function () {
        draw();
    }, 500);
}
window.onresize = resize;
resize();

function getAngle(obj1, obj2) {
    var y = (obj1.y - obj2.y);
    var x = (obj1.x - obj2.x);
    return Math.atan( x / y );
}

function dist(obj1, obj2) {
    return Math.sqrt(Math.pow(obj2.x - obj1.x, 2) - Math.pow(obj2.y - obj1.y, 2));
}
function r(a) {
    // return a;
    return a * 180 / Math.PI;
}
function koch_snowflake(options) {
    var angle = options.angle;
    if (options.level <= 0) {
        ctx.beginPath();
        ctx.moveTo(options.coord[0].x, options.coord[0].y);
        ctx.lineTo(options.coord[1].x, options.coord[1].y);
        ctx.stroke();
        return;
    }

    var p1 = {
        x: options.coord[0].x + (options.coord[1].x - options.coord[0].x) * (options.child),
        y: options.coord[0].y + (options.coord[1].y - options.coord[0].y) * (options.child)
    };
    var p2 = {
        x: options.coord[1].x - (options.coord[1].x - options.coord[0].x) * (options.child),
        y: options.coord[1].y - (options.coord[1].y - options.coord[0].y) * (options.child)
    };
    var p4 = {
        x: p2.x-p1.x,
        y: p2.y-p1.y
    };
    var p3 = {
            x: p1.x + p4.x * Math.cos(-angle) - p4.y * Math.sin(-angle),
            y: p1.y + p4.y * Math.cos(-angle) + p4.x * Math.sin(-angle)
    };
    var level;
    if (options["go crazy"]) {
        var x = Math.random() * -2 + 1;
        options.angle = x / Math.abs(x) * angle;
        level = ~~(Math.random() * options.level);
    } else {
        level = options.level - 1;
    }
    koch_snowflake({
        coord: [
            options.coord[0],
            p1
        ],
        level: level,
        child: options.child,
        angle: options.angle,
        "go crazy": options["go crazy"]
    });
    koch_snowflake({
        coord: [
            p1,
            p3
        ],
        level: level,
        child: options.child,
        angle: options.angle,
        "go crazy": options["go crazy"]
    });
    koch_snowflake({
        coord: [
            p3,
            p2
        ],
        level: level,
        child: options.child,
        angle: options.angle,
        "go crazy": options["go crazy"]
    });
    koch_snowflake({
        coord: [
            p2,
            options.coord[1],
        ],
        level: level,
        child: options.child,
        angle: options.angle,
        "go crazy": options["go crazy"]
    });
}
var glob = {
    level: 1,
    child: 1 / 3,
    angle: Math.PI / 3,
    "go crazy": false,
    lineWidth: 10
};
function draw() {
    ctx.clearRect(0, 0, can.width, can.height);
    ctx.lineWidth = glob.lineWidth;
    ctx.lineCap = "round";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    koch_snowflake({
        coord: [{
                x: can.width / 3,
                y: can.height / 3
            },
            {
                x: can.width - can.width / 3,
                y: can.height / 3
            }
        ],
        level: glob.level,
        child: glob.child,
        angle: glob.angle,
        "go crazy":glob["go crazy"]
    });
    koch_snowflake({
        coord: [{
            x: can.width / 2,
            y: can.height - can.height / 6
        }, {
            x: can.width / 3,
            y: can.height / 3
        }],
        level: glob.level,
        child: glob.child,
        angle: glob.angle,
        "go crazy": glob["go crazy"]
    });
    koch_snowflake({
        coord: [{
            x: can.width - can.width / 3,
            y: can.height / 3
        }, {
            x: can.width / 2,
            y: can.height - can.height / 6
        }],
        level: glob.level,
        child: glob.child,
        angle: glob.angle,
        "go crazy": glob["go crazy"]
    });
    ctx.closePath();
}
draw();
var level = 7;
setInterval(function () {
    glob.level = ++glob.level % level;
    draw();
},1000);