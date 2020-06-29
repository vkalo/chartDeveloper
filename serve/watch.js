var watch = require('watch')
var { join, resolve } = require('path');
var { readFileSync } = require('fs');
var {chartInfo} = require('../serve/loadChart');
const { transLateFiles } = require('./transcoding');
const webSocket = require('./webSocket');

const { inlet } = JSON.parse(readFileSync(join(__dirname, './config.json')));

watch.createMonitor(inlet, function (monitor) {

  // monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.
  monitor.on("created", function (f, stat) {
    console.log(f, 'created')
    // Handle new files
  })
  monitor.on("changed", function (f, curr, prev) {
    console.log(f, 'changed');
    const packageJson = JSON.parse(readFileSync(resolve(inlet, 'package.json'), 'utf-8'));
    const chartName = packageJson.name + '@' + packageJson.version+'/';
    const modulePath = f.replace(inlet, chartName);
    chartInfo.file[modulePath]  = transLateFiles (f,{},modulePath);

    webSocket.connections.forEach(function (conn) {
      conn.sendText('刷新')
    })
    // Handle file changes
  })
  monitor.on("removed", function (f, stat) {
    console.log(f, 'changed')
    // Handle removed files
  })
  // monitor.stop(); // Stop watching
})