[1mdiff --git a/routes/api/chat/controller.js b/routes/api/chat/controller.js[m
[1mindex 2c56ebd..1ece302 100644[m
[1m--- a/routes/api/chat/controller.js[m
[1m+++ b/routes/api/chat/controller.js[m
[36m@@ -24,7 +24,7 @@[m [mexports.getMessages = function (req, res) {[m
 exports.getMessage = function (req, res) {[m
     var chatNum = parseInt(req.params.chatNum);[m
 [m
[31m-    model.getMessage('matching', req.user.nickname, chatNum, function (err, result, opponentNickname, classStatusCode, isWriter) {[m
[32m+[m[32m    model.getMessage('matching', req.user.nickname, chatNum, function (err, result, opponentNickname, classStatusCode, isWriter, classNum) {[m
         // mongodb에서 검색된 내용이 바로 채워지지 않아서 nextTick 추가[m
         process.nextTick( function () {[m
             if (err) {[m
[36m@@ -39,7 +39,8 @@[m [mexports.getMessage = function (req, res) {[m
                         status: classStatusCode,[m
                         mode: 'matching',[m
                         log: result.log,[m
[31m-                        isWriter: isWriter[m
[32m+[m[32m                        isWriter: isWriter,[m
[32m+[m			[32mclassNum: classNum[m
                     });[m
                 }[m
             }[m
[36m@@ -95,6 +96,14 @@[m [mexports.handleMatch = function (req, res) {[m
                     }[m
                 });[m
 [m
[32m+[m		[32mprocess.umask(777);[m
[32m+[m[32m                fs.mkdir('/root/store/' + result[0].classNum + '/src', 0777, function (err){[m
[32m+[m[32m                    if (err){[m
[32m+[m[32m                        console.log('file system error, mkdir');[m
[32m+[m[32m                        res.status(500).send('Err: server error');[m
[32m+[m[32m                    }[m
[32m+[m[32m                });[m
[32m+[m		[32mexec('echo \"#include <stdio.h>\n\nint main(){\n\tprintf("Hello World\n");\n}\" > /root/store/' + result[0].classNum + '/src/main.c');[m
                 exec('docker run -d -p '+ result[0].classNum +':22 -h Terminal --cpu-quota=25000 --name '+[m
                     result[0].classNum +' -v /root/store/'+ result[0].classNum +':/home/coco coco:0.4',function (err, stdout){[m
                     if (err) {[m
[1mdiff --git a/routes/api/chat/model.js b/routes/api/chat/model.js[m
[1mindex 4a30ccc..5aba17e 100644[m
[1m--- a/routes/api/chat/model.js[m
[1m+++ b/routes/api/chat/model.js[m
[36m@@ -14,9 +14,10 @@[m [mexports.getMessages = function (nickName, callback) {[m
 };[m
 [m
 function getChatOpponentNickname (chatRoomNumber) {[m
[31m-    return knex('Chat').where({[m
[32m+[m[32m    knex('Chat').where({[m
         num: chatRoomNumber[m
[31m-    }).select('writer', 'applicant', 'classNum');[m
[32m+[m[32m    }).select('writer', 'applicant', 'classNum').then(function (row) { console.log('???????????????', row);[m[41m [m
[32m+[m[32m    return row; });[m
 }[m
 [m
 exports.changeStatus = function (classNum, value, callback) {[m
[36m@@ -44,10 +45,17 @@[m [mexports.Match = function (ClassNum, applicant, callback){[m
 // result 값이 router로 전달되지 않아서 callback으로 설계[m
 // mode: 'matching' (매칭 중일 때의 채팅) or 'class' (에디터 접속 후 채팅)[m
 exports.getMessage = function (mode, userNickname, chatNumber, callback) {[m
[31m-    var classData = getChatOpponentNickname(chatNumber);[m
[31m-[m
[32m+[m[32m    //var classData = getChatOpponentNickname(chatNumber);[m
     var opponentNickname, isWriter;[m
 [m
[32m+[m	[32mknex('Chat')[m
[32m+[m		[32m.where({[m
[32m+[m		[32mnum: chatNumber})[m
[32m+[m		[32m.select('writer', 'applicant', 'classNum')[m
[32m+[m		[32m.then(function (result) {[m
[32m+[m		[32mvar classData = result[0];[m
[32m+[m
[32m+[m[32mprocess.nextTick(function () {[m
     if (classData.writer === userNickname) {[m
         opponentNickname = classData.applicant;[m
         isWriter = true;[m
[36m@@ -56,19 +64,28 @@[m [mexports.getMessage = function (mode, userNickname, chatNumber, callback) {[m
         isWriter = false;[m
     }[m
 [m
[31m-    var classStatusCode = boardModel.getStatus(classData.num);[m
[32m+[m	[32mknex('Class')[m
[32m+[m		[32m.where({[m
[32m+[m		[32mnum: classData.classNum})[m
[32m+[m		[32m.select('status')[m
[32m+[m		[32m.then(function (result2) {[m
[32m+[m[41m    [m
[32m+[m[32m    var classStatusCode = result2[0].status;[m
 [m
     mongodb(function (db) {[m
         db.collection(mode).findOne( { _id : chatNumber }, function (err, result) {[m
             if (err) {[m
                 callback(err);[m
             } else {[m
[31m-                callback(null, result, opponentNickname, classStatusCode, isWriter);[m
[32m+[m[32m                callback(null, result, opponentNickname, classStatusCode, isWriter, classData.classNum);[m
             }[m
         });[m
 [m
         db.close();[m
     });[m
[32m+[m[32m    });[m
[32m+[m[32m    });[m
[32m+[m[32m    });[m
 };[m
 [m
 // 기존 Document에 메시지 추가[m
