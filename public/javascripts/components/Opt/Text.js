
const template = `<input
  class="text-wrapper"
    type="text"
    ref="vInput"
    :placeholder="(config && config.placeholder) || '请输入文本'"
    :value="value"
    @change="handleChange"
  />`

/**
 * @name 配置面板控件-文本输入框
 * @desc 配置字符串、数值类型的数据。
 * @param {Object} config 默认配置{default-默认值}
 * @param {String, Number} value 传入值
 * @event change 更新父组件的传入值
 * @eg <OptText :config="config" :value="value" @change="change" />
 */
import optMixin from './js/mixins.js';
export default {
  name: 'OptText',
  mixins: [optMixin],
  template,
  props: {
    value: [String, Number],
  },
  data() {
    return {
      innerValue: this.value,
    };
  },
  watch: {
    value(val) {
      this.innerValue = val;
    },
  },
  methods: {
    handleChange(e) {
      const value = e.target.value;
      this.innerValue = value;
      this.$emit('change', this.innerValue);
    },
  },
};
