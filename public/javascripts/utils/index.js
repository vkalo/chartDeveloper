

/** 从配置项中抽取值
 * @param options Object 需要抽取的配置项 ex:{"fontFamily":{"type":"select","name":"字体","default":"微软雅黑"}
 * @returns Object 抽取后的配置项 ex {fontFamily:"微软雅黑"}
 */
export function getOptionsValue(options) {
  return Object.entries(options).reduce((res, [key, item]) => {
    if (item.type === 'group') {
      const { show = null } = item;
      res[key] = getOptionsValue(item.children || []);
      show !== null && (res[key].show = show);
    } else {
      res[key] = item.default;
    }
    return res;
  }, {});
}

// 处理组件数据更新时调用的方法
export function getHandler(chart, handler) {
  if (handler) {
    return chart[handler].bind(chart);
  } else if (typeof chart.updateData == 'function') {
    return chart.updateData.bind(chart);
  } else {
    return chart.render.bind(chart);
  }
}

// 组件数据更新参数
export function getSource(source) {
  const sourceKeys = Object.keys(source);
  if (sourceKeys.length === 1) {
    return source[sourceKeys[0]];
  }
  return source;
}

export function load(src) {
  return new Promise((resolve, reject) => {
    try {
      opener(src, (text) => {
        console.log(text)
        resolve(text);
      })
    } catch (err) {
      reject(err);
    }
  })
}
/**
 * 设置像素数值方法
 * @param {String|Number}} n 像素数值
 */
export function setPx(n){
  return n ? parseInt(n) + 'px' : null;
};

export default {
  getOptionsValue,
  getHandler,
  getSource,
  setPx,
  load,
};
