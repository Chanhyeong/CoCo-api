var statusConst = {
    'NOT': 0,
    'STUDENT': 1,
    'TUTOR': 2,
    'MATCHED': 3,
    'END': 4
};

// function Board () {
//     this.num;
//     this.title;
//     this.content;
//     this.language;
//     this.status;
//     this.tutorNick;
//     this.studentNick;
// }

exports.getConst = function (mode) {
    return statusConst[mode];
};