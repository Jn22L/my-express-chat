var socket = io();

console.log("클라이언트 소켓", socket);

socket.name = "";
socket.color = "";

/* 접속 되었을 때 실행 */
socket.on("connect", function () {
  /* 이름을 입력받고 */
  //var name = prompt('반갑습니다!', '')

  /* 이름이 빈칸인 경우 */
  if (!name) {
    name = "익명";
  }

  /* 서버에 새로운 유저가 왔다고 알림 */
  //socket.emit('newUser', name)
});

/* 서버로부터 데이터 받은 경우 */
socket.on("update", function (data) {
  console.log("서버로부터 받은", data);
  var chat = document.getElementById("chat");
  var message = document.createElement("div");
  //var node = document.createTextNode(`[${data.name}] ${data.message}`);
  var node = document.createElement("div");
  node.innerHTML = `<span style="${data.color}">[${data.name}]</span><span style="${data.color}">${data.message}</span>`;
  var className = "";

  // 타입에 따라 적용할 클래스를 다르게 지정
  switch (data.type) {
    case "message":
      className = "other";
      break;

    case "connect":
      className = "connect";
      break;

    case "disconnect":
      className = "disconnect";
      break;
  }

  message.classList.add(className);
  message.appendChild(node);
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight; // 스크롤 맨 아래로
});

/* 참여하기 */
function join() {
  var input_name = document.getElementById("join_input");
  var btn_join = document.getElementById("join_btn");
  console.log(input_name.value);
  if (input_name.value.trim() == "") {
    alert("닉네님을 입력하세요!");
    document.getElementById("join_input").value = "";
    return;
  }

  var input_send = document.getElementById("input_send");
  var btn_send = document.getElementById("btn_send");

  input_name.style.visibility = "hidden";
  btn_join.style.visibility = "hidden";

  input_send.style.visibility = "visible";
  //btn_send.style.visibility = "visible";
  input_send.focus();

  /* 소켓에 유저 색상 저장 */
  //var ranNumber = Math.floor(Math.random() * 10);
  //var color = Math.floor(Math.random() * 10);

  const date = new Date();
  var seconds = String(date.getSeconds()).slice(-1);
  console.log("seconds", seconds);
  if (seconds >= 0 && seconds <= 2) {
    color = "color:#4285f4;"; //구글 BLUE
  } else if (seconds >= 3 && seconds <= 5) {
    color = "color:#cc6600;"; // 갈색
  } else if (seconds >= 6 && seconds <= 8) {
    color = "color:#0f9d58;"; // 구글 GREEN
  } else {
    color = "color:black;";
  }
  socket.color = color;

  /* 소켓에 유저 이름 저장 */
  socket.name = input_name.value;

  console.log("클소켓", socket);

  /* 서버에 새로운 유저가 왔다고 알림 */
  socket.emit("newUser", { type: "message", name: input_name.value, color: color });
}

/* 메시지 전송 함수 */
function send() {
  console.log("socket", socket.name);
  // 입력되어있는 데이터 가져오기
  var message = document.getElementById("input_send").value;

  if (message.trim() == "") {
    //alert("내용을 입력하세요!");
    //document.getElementById("input_send").value = "";
    return;
  }

  // 가져왔으니 데이터 빈칸으로 변경
  document.getElementById("input_send").value = "";

  // 내가 전송할 메시지 클라이언트에게 표시
  var chat = document.getElementById("chat");
  var msg = document.createElement("div");
  //var node = document.createTextNode(message);
  var node = document.createElement("div");
  node.innerHTML = `<span style="${socket.color}">[${socket.name}]</span><span style="${socket.color}">${message}</span>`;
  msg.classList.add("me");
  msg.appendChild(node);
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight; // 스크롤 맨 아래로

  // 서버로 message 이벤트 전달 + 데이터와 함께
  socket.emit("message", { type: "message", message: message });
}
