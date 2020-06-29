var ws = new WebSocket(`ws://${location.hostname}:3001`);

ws.onopen = function (e) {
  console.log("连接服务器成功");
  ws.send("game1");
}
ws.onclose = function (e) {
  console.log("服务器关闭");
}
ws.onerror = function () {
  console.log("连接出错");
}

ws.onmessage = function (e) {
  const { data } = e;
  if (data === '刷新') {
    location.reload(true)
  }
}