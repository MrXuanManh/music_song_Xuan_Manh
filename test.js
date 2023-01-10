const a = 2;
const b = 3;
var oj = {
    arr: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
    ],
    xuly: function () {
       console.log(this)
    },
    start: function () {
        this.xuly();
    }
}
oj.start();