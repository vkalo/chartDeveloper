const template = `
  <div class="opt-unknown" style="color:red">unknown type: {{ config.type }}</div>
`

/**
 * @name 配置面板控件-未知类型
 * @desc 未知类型提示。
 * @param {Object} config 默认配置
 * @eg <OptUnknown :config="config" />
 */
export default {
  props: ['config', 'value'],
};

