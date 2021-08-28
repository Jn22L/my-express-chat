var pos = {
  drawable: false,
  from_X: -1,
  from_Y: -1,
  x: -1,
  y: -1,
  color: "black",
  lineWidth: 1,
};

var canvas, ctx;

function initDraw(event) {
  ctx.beginPath();
  pos.drawable = true;
  var coors = getPosition(event);
  pos.from_X = pos.X;
  pos.from_Y = pos.Y;
  pos.X = coors.X;
  pos.Y = coors.Y;
  ctx.moveTo(pos.X, pos.Y);

  // 서버로 좌표 전송
  socket.emit("draw", { type: "move", X: pos.X, Y: pos.Y, color: pos.color, lineWidth: pos.lineWidth });
}

function draw(event) {
  var coors = getPosition(event);

  pos.from_X = pos.X; // 이전 X 좌표 저장
  pos.from_Y = pos.Y; // 이전 Y 좌표 저장
  pos.X = coors.X;
  pos.Y = coors.Y;

  ctx.lineWidth = pos.lineWidth;
  ctx.strokeStyle = pos.color;

  ctx.moveTo(pos.from_X, pos.from_Y);
  ctx.lineTo(coors.X, coors.Y);
  ctx.stroke();

  // 서버로 좌표 전송
  socket.emit("draw", { type: "draw", from_X: pos.from_X, from_Y: pos.from_Y, X: pos.X, Y: pos.Y, color: pos.color, lineWidth: pos.lineWidth });
}

function finishDraw() {
  pos.drawable = false;
  pos.X = -1;
  pos.Y = -1;

  // 서버로 좌표 전송
  socket.emit("draw", { type: "finishDraw", X: pos.X, Y: pos.Y, color: pos.color, lineWidth: pos.lineWidth });
}

function getPosition(event) {
  // css 에서 position:fixed 설정시 8차이 발생 -> 주석
  // var x = event.pageX - canvas.offsetLeft;
  // var y = event.pageY - canvas.offsetTop;

  // 좌표 8 차이 보정 하드코딩 : 추후 시간되면 찾아볼것 ?
  var x = event.pageX - canvas.offsetLeft - 8;
  var y = event.pageY - canvas.offsetTop - 8;

  return { X: x, Y: y };
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  pos.lineWidth = 1;
  pos.color = "black";
}

/**
 * 서버에서 canvas 좌표 수신시
 *
 * @param
 * @return
 */
socket.on("draw", function (data) {
  switch (data.type) {
    case "move":
      ctx.beginPath();
      ctx.moveTo(data.X, data.Y);
      break;
    case "draw":
      ctx.lineWidth = data.lineWidth;
      ctx.strokeStyle = data.color;
      ctx.moveTo(data.from_X, data.from_Y);
      ctx.lineTo(data.X, data.Y);
      ctx.stroke();
      break;
    case "finishDraw":
      break;
  }
});

function listener(event) {
  switch (event.type) {
    case "mousedown":
    case "touchstart":
      initDraw(event);
      break;
    case "mousemove":
    case "touchmove":
      if (pos.drawable) draw(event);
      break;
    case "mouseout":
    case "mouseup":
    case "touchend":
      finishDraw();
      break;
  }
}

function choiceColor(event) {
  let choiceColor = event.target.dataset.color;

  if (event.target.id.slice(0, 5) === "color") {
    ctx.lineWidth = 1;
    ctx.strokeStyle = choiceColor;
    pos.lineWidth = 1;
    pos.color = choiceColor;
  }
  if (event.target.id === "color-white") {
    ctx.lineWidth = 10;
    pos.lineWidth = 10;
  }
}

// PC, MOBILE 구별
function deviceCheck() {
  console.log("deviceCheck");
  var pcDevice = "win16|win32|win64|mac|macintel";
  if (navigator.platform) {
    if (pcDevice.indexOf(navigator.platform.toLowerCase()) < 0) {
      // Mobile 접속시, 채팅창 사이즈 줄이기( 가상키보드 올라와도 canvas 고정되게)
      // ( 그러나, 스크롤 생기면서 움직임... 나중에 볼것 ?)
      //console.log("MOBILE");
      //alert("mobile.deviceCheck");
      document.getElementById("chat").setAttribute("class", "device-mobile");
    } else {
      //console.log("PC");
      //alert("PC.deviceCheck");
      document.getElementById("chat").setAttribute("class", "device-pc");
    }
  }
}

window.onload = function () {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.addEventListener("mousedown", listener);
  canvas.addEventListener("mousemove", listener);
  canvas.addEventListener("mouseup", listener);
  canvas.addEventListener("mouseout", listener);
  canvas.addEventListener("touchstart", listener);
  canvas.addEventListener("touchmove", listener);
  canvas.addEventListener("touchend ", listener);

  document.getElementById("canvas_clear").addEventListener("click", clearCanvas);
  document.getElementById("control-buttons").addEventListener("click", choiceColor);

  window.addEventListener("resize", deviceCheck);

  deviceCheck();
};
