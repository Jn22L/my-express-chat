var socket = io();

/**
 * 최초접속시
 *
 * @param
 * @return
 */
socket.on("connect", function () {
  console.log("connect");
});

/**
 * 닉네임 입력후 엔터 입력시
 *
 * @param
 * @return
 */
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

  input_name.style.visibility = "hidden";
  btn_join.style.visibility = "hidden";

  input_send.style.visibility = "visible";
  input_send.focus();

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

  let userName = input_name.value;
  let userColor = color;

  socket.emit("newUser", { type: "message", userName, userColor });
}

/**
 * 서버에서 메시지 받을때
 *
 * @param
 * @return
 */
socket.on("update", function (data) {
  console.log("서버로부터 받은", data);
  var chat = document.getElementById("chat");
  var message = document.createElement("div");
  var node = document.createElement("div");
  node.innerHTML = `<span style="${data.userColor}">[${data.userName}] ${data.message}</span>`;
  var className = "";

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

/**
 * 서버로 메시지 보낼때
 *
 * @param
 * @return
 */
function send() {
  var message = document.getElementById("input_send").value;
  if (message.trim() == "") {
    return;
  }
  document.getElementById("input_send").value = "";
  socket.emit("message", { type: "message", message });
}
