function packCode(id, dependent, text) {
  if (typeof dependent === 'string') {
    text ? (dependent = [dependent]) : (text = dependent, dependent = [])
  }
  dependent = Array.isArray(dependent) ? dependent : Object.keys(dependent);
  return `pack('${id}',[${dependent.map(i => `'${i}'`).toString()}], function (opener, exports, module){
    ${text}
  });`;
};

module.exports = { packCode }