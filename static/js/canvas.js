var pos = {
  drawable: false,
  from_X: -1,
  from_Y: -1,
  x: -1,
  y: -1,
};

var canvas, ctx;

function initDraw(event) {
  console.log("draw event 이벤트", event);

  ctx.beginPath();
  pos.drawable = true;
  var coors = getPosition(event);
  pos.from_X = pos.X;
  pos.from_Y = pos.Y;
  pos.X = coors.X;
  pos.Y = coors.Y;
  ctx.moveTo(pos.X, pos.Y);

  // 서버로 좌표 전송
  socket.emit("draw", { type: "move", X: pos.X, Y: pos.Y });
}

function draw(event) {
  var coors = getPosition(event);

  pos.from_X = pos.X; // 이전 X 좌표 저장
  pos.from_Y = pos.Y; // 이전 Y 좌표 저장
  pos.X = coors.X;
  pos.Y = coors.Y;

  ctx.moveTo(pos.from_X, pos.from_Y);
  ctx.lineTo(coors.X, coors.Y);
  ctx.stroke();

  // 서버로 좌표 전송
  socket.emit("draw", { type: "draw", from_X: pos.from_X, from_Y: pos.from_Y, X: pos.X, Y: pos.Y });
}

function finishDraw() {
  pos.drawable = false;
  pos.X = -1;
  pos.Y = -1;

  // 서버로 좌표 전송
  socket.emit("draw", { type: "finishDraw", X: pos.X, Y: pos.Y });
}

function getPosition(event) {
  console.log(event);

  // css 에서 position:fixed 설정시 8차이 발생 -> 주석
  // var x = event.pageX - canvas.offsetLeft;
  // var y = event.pageY - canvas.offsetTop;

  // 좌표 8 차이 보정 하드코딩 : 추후 시간되면 찾아볼것 ?
  var x = event.pageX - canvas.offsetLeft - 8;
  var y = event.pageY - canvas.offsetTop - 8;

  return { X: x, Y: y };
}

function clearCanvas() {
  console.log("clearCanvas");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
}

/**
 * 서버에서 canvas 좌표 수신시
 * -> 동시에 그릴때 엉망되는 문제 .. 어떻게 분리하지?
 * @param
 * @return
 */
socket.on("draw", function (data) {
  console.log("좌표수신", data);
  switch (data.type) {
    case "move":
      ctx.moveTo(data.X, data.Y);
      break;

    case "draw":
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
};
