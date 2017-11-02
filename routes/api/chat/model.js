var mongodb = require('../../../middleware/database')('mongodb');

// TODO: 클래스 생성 시 동시에 동작하도록
// 클래스 생성 시 새로운 채팅방 생성, 관리자 안내 메시지 추가
// mode: 'matching', 'class'
exports.create = function (mode, chatNumber) {
    var time = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '');     // delete the dot and everything after

    var form = {
        _id: chatNumber,
        log: [
            {
                id: 'admin',
                message: '여기서 강의 내용에 대한 질문/답변을 진행하세요.',
                date: time
            }
        ]
    };

    mongodb.createChat(mode, chatNumber, form, function (err) {
        return err;
    });
};


// TODO: 채팅방 삭제 구현
exports.delete = function () {

};