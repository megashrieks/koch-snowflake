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
        x: p2.x - p1.x,
        y: p2.y - p1.y
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
    level: 5,
    child: 1 / 3,
    angle: Math.PI / 3,
    "go crazy": false,
    lineWidth: 1,
    timer: true,
    "max level": 5,
    "line cap": "round"
};
var prev_glob;
function draw() {
    ctx.clearRect(0, 0, can.width, can.height);
    ctx.lineWidth = glob.lineWidth;
    ctx.lineCap = glob["line cap"];
    ctx.shadowBlur = 5;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    var mw = can.width, mh = can.height;
    var w = mw - 2 * mw / 3;
    var tilt = Math.sin(Math.PI / 3);
    var offset = w * glob.child * Math.sin(glob.angle) / 2;
    var hs = mh / 2 - tilt * w / 2 + offset;
    var p1 = {
        x: can.width / 3,
        y: hs
    };
    var p2 = {
        x: can.width - can.width / 3,
        y: hs
    };
    var p3 = {
        x: can.width / 2,
        y: can.height / 2 + tilt * w / 2 + offset
    };
    koch_snowflake({
        coord: [p1, p2],
        level: glob.level,
        child: glob.child,
        angle: glob.angle,
        "go crazy": glob["go crazy"]
    });
    koch_snowflake({
        coord: [p3, p1],
        level: glob.level,
        child: glob.child,
        angle: glob.angle,
        "go crazy": glob["go crazy"]
    });
    koch_snowflake({
        coord: [p2, p3],
        level: glob.level,
        child: glob.child,
        angle: glob.angle,
        "go crazy": glob["go crazy"]
    });
    ctx.closePath();
}
draw();
function gui() {
    var g = new dat.GUI();
    g.add(glob, "level", 0, 8).step(1).listen();
    g.add(glob, "max level", 0, 8).step(1).listen();
    g.add(glob, "lineWidth", 1, 50).step(1);
    g.add(glob, "go crazy");
    g.add(glob, "timer");
    g.add(glob, "line cap", { round: "round", butt: "butt" });
}
gui();
function dloop() {
    if (!glob.timer) {
        if (JSON.stringify(prev_glob) != JSON.stringify(glob)) {
            prev_glob = Object.assign({}, glob);
            draw();
        }
    }
    requestAnimationFrame(dloop);
}
dloop();
setInterval(function () {
    if (glob.timer) {
        glob.level = ++glob.level % (glob["max level"] + 1);
        draw();
    }
}, 1000);