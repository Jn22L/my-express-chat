var pos = {
  drawable: false,
  x: -1,
  y: -1,
};
var canvas, ctx;

function initDraw(event) {
  ctx.beginPath();
  pos.drawable = true;
  var coors = getPosition(event);
  pos.X = coors.X;
  pos.Y = coors.Y;
  ctx.moveTo(pos.X, pos.Y);

  // 서버로 좌표 전송
  socket.emit("draw", { type: "move", X: pos.X, Y: pos.Y });
}

function initDraw2(event) {
  ctx.beginPath();
  pos.drawable = true;
  var coors = getPosition(event);
  pos.X = coors.X;
  pos.Y = coors.Y;
  ctx.moveTo(pos.X, pos.Y);

  // 서버로 좌표 전송
  socket.emit("draw", { type: "move", X: pos.X, Y: pos.Y });
}

function draw(event) {
  var coors = getPosition(event);
  ctx.lineTo(coors.X, coors.Y);
  pos.X = coors.X;
  pos.Y = coors.Y;
  ctx.stroke();

  // 서버로 좌표 전송
  socket.emit("draw", { type: "draw", X: pos.X, Y: pos.Y });
}

function draw2(event) {
  var coors = getPosition(event);
  ctx.lineTo(coors.X, coors.Y);
  pos.X = coors.X;
  pos.Y = coors.Y;
  ctx.stroke();

  // 서버로 좌표 전송
  socket.emit("draw", { type: "draw", X: pos.X, Y: pos.Y });
}

function finishDraw() {
  pos.drawable = false;
  pos.X = -1;
  pos.Y = -1;

  // 서버로 좌표 전송
  socket.emit("draw", { type: "finishDraw", X: pos.X, Y: pos.Y });
}

function finishDraw2() {
  pos.drawable = false;
  pos.X = -1;
  pos.Y = -1;

  // 서버로 좌표 전송
  socket.emit("draw", { type: "finishDraw", X: pos.X, Y: pos.Y });
}

function getPosition(event) {
  var x = event.pageX - canvas.offsetLeft;
  var y = event.pageY - canvas.offsetTop;
  return { X: x, Y: y };
}

/**
 * 서버에서 canvas 좌표 수신시
 * -> 동시에 그릴때 엉망되는 문제 .. 어떻게 분리하지?
 * @param
 * @return
 */
socket.on("draw", function (data) {
  switch (data.type) {
    case "move":
      ctx.moveTo(data.X, data.Y);
      break;

    case "draw":
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
      initDraw(event);
      break;
    case "mousemove":
      if (pos.drawable) draw(event);
      break;
    case "mouseout":
    case "mouseup":
      finishDraw();
      break;
    case "touchstart":
      initDraw2(event);
      break;
    case "touchmove":
      if (pos.drawable) draw2(event);
      break;
    case "touchend":
      finishDraw2();
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
};
