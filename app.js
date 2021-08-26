const express = require("express");
const socket = require("socket.io");
const http = require("http");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use("/css", express.static("./static/css"));
app.use("/js", express.static("./static/js"));

app.get("/", function (request, response) {
  fs.readFile("./static/index.html", function (err, data) {
    if (err) {
      response.send("에러");
    } else {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    }
  });
});

io.sockets.on("connection", function (socket) {
  /* 닉네임 입력후 조인 */
  socket.on("newUser", function (data) {
    console.log("newUser.data", data);
    socket.userName = data.userName;
    socket.userColor = data.userColor;
    io.sockets.emit("update", { type: "connect", userName: "SERVER", message: data.userName + "님이 접속하였습니다." });
  });

  /* 메시지 수신 */
  socket.on("message", function (data) {
    data.userName = socket.userName;
    data.userColor = socket.userColor;

    //socket.broadcast.emit("update", data); // 자신을 제외한 모든 socket 에게 emit
    io.sockets.emit("update", data); // 모든 socket 에게 emit
    console.log("data", data);
  });

  /* canvas 좌표 수신 */
  socket.on("draw", function (data) {
    console.log("message.data", data);

    //data.userName = socket.userName;
    //data.userColor = socket.userColor;

    socket.broadcast.emit("draw", data); // 자신을 제외한 모든 socket 에게 emit
    //io.sockets.emit("update", data); // 모든 socket 에게 emit
    //console.log("data", data);
  });

  /* 접속 해제 */
  socket.on("disconnect", function () {
    console.log(socket.name + "님이 나가셨습니다.");
    socket.broadcast.emit("update", { type: "disconnect", userName: "SERVER", message: socket.userName + "님이 나가셨습니다." });
  });
});

/* 서버를 8080 포트로 listen - process.env.PORT 를 추가해 주어 heroku 에서 실행될 수 있게 해준다.*/
server.listen(process.env.PORT || 8080, function () {
  console.log("서버 실행 중..");
});
