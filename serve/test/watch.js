var watch = require('watch')
const webSocket = require('./webSocket');
const { modifyFile, deleteFile } = require('./loadChart');
const { inlet } = require('./init');
watch.createMonitor(inlet, function (monitor) {
  // monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.
  monitor.on("created", function (f, stat) {
    console.log(f, 'created')
    modifyFile(f);
    // Handle new files
  })
  monitor.on("changed", function (f, curr, prev) {
    console.log(f, '文件修改');
    modifyFile(f);
    console.log('热更新开始')
    webSocket.connections.forEach(function (conn) {
      conn.sendText('刷新')
    })
    // Handle file changes
  })
  monitor.on("removed", function (f, stat) {
    console.log(f, '移除文件')
    deleteFile(f);
    // Handle removed files
  })
  // monitor.stop(); // Stop watching
})