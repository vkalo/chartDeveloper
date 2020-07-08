
const webSocket = require('./webSocket');
const config = {
  "inlet": "/Users/likairui/Desktop/demos/chart/",
  "entryPath": "/Users/likairui/Desktop/demos/chart/index.js",
  "outlet": "/Users/likairui/Desktop/demos/chartDeveloper/out/",
  "chartName": "globe_3d@0.0.1",
  "extra": ["/Users/likairui/Desktop/demos/chart/package.json"],
  hotCallback: [function (f, t) {
    webSocket.connections.forEach(function (conn) {
      conn.sendText('刷新')
    })
  }],
};

var init = require('../../pack-opener-plugin');
const moduleInfo = init(config);
moduleInfo.hotCallback = config.hotCallback;

module.exports = moduleInfo;