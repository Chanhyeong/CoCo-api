var statusConst = {
    'NOT': 0,
    'ON': 1,
    'MATCHED': 2,
    'END': 3
};

function Board () {
    this.num;
    this.title;
    this.content;
    this.language;
    this.status;
    this.tutorNick;
    this.studentNick;
}

exports.getConst = function (mode) {
    return statusConst[mode];
};