
  const template = `<span
    :class="value ? 'switch switch-on' : 'switch'"
    :value="innerValue"
    @click="handleChange"
  >
  </span>`

/**
 * @name 配置面板控件-开关
 * @desc 配置布尔值类型的数据。
 * @param {Object} config 默认配置{default-默认数据 ...}
 * @param {Boolean} value 传入值
 * @event change 更新父组件的传入值
 * @eg <OptBoolean :config="config" :value="value" @change="change" />
 */
import optMixin from './js/mixins.js';
export default {
  name: 'Boolean',
  template,
  mixins: [optMixin],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(val) {
      this.innerValue = val;
    },
  },
  data() {
    return {
      innerValue: this.value,
    };
  },
  methods: {
    handleChange() {
      this.$emit('change', !this.innerValue);
    },
  },
};
