const template = `
  <div
    class="input-number-wrapper"
    :style="{ width: size === 'mini' ? '90px' : '212px' }"
  >
    <input
      type="number"
      :value="displayValue"
      :disabled="disabled"
      @input="handleInput"
      @change="handleChange"
    />
    <div class="operator-box">
      <span class="operator" @click="handleCalc('+')">
        <div class="top-triangle"></div>
      </span>
      <span class="operator" @click="handleCalc('-')">
        <div class="bottom-triangle"></div>
      </span>
    </div>
    <div v-if="label" class="label-box">{{ label }}</div>
  </div>
`
/**
 * @name 配置面板控件-数值输入框
 * @desc 配置数值类型的数据。
 * @param {Object} config 默认配置{max-最大值 min-最小值 step-步长 label-文字 size-大小 default-默认值}
 * @param {Number} value 传入值
 * @event change 更新父组件的传入值
 * @eg <OptNumber :config="config" :value="value" @change="change" />
 */
import optMixin from './js/mixins.js';
export default {
  name: 'Number',
  template,
  mixins: [optMixin],
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      max:
        this.config.max || this.config.max === 0 ? this.config.max : Infinity, // 最大值
      min:
        this.config.min || this.config.min === 0 ? this.config.min : -Infinity, // 最小值
      label: this.config.label || '', // 文字标签
      disabled: this.config.disabled || false, // 是否禁用
      size: this.config.size || 'normal', // 控件大小
      step: this.config.step || 1, // 步长
      precision:
        this.config.precision || this.config.precision === 0
          ? this.config.precision
          : null, // 精度
      iVal: null, // 用户输入的值
      cVal: 0, // 当前的值
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        const newVal = val === undefined ? val : Number(val);
        this.iVal = newVal;
        this.cVal = newVal;
      },
    },
  },
  computed: {
    displayValue() {
      const { iVal, cVal } = this;
      if (iVal || iVal === '') {
        return iVal;
      }
      return cVal;
    },
  },
  methods: {
    // 操作符计算
    handleCalc(operator) {
      const { cVal, step } = this;
      const val = operator === '+' ? cVal + step : cVal - step;
      this.setLastVal(val);
    },
    // 设置终值
    setLastVal(val) {
      const { min, max, precision } = this;
      const p = String(precision);
      this.iVal = val < min ? min : val > max ? max : val;
      this.cVal =
        p !== 'null' ? parseFloat(this.iVal.toFixed(precision)) : this.iVal;
      this.$emit('change', this.cVal);
      this.iVal = null;
    },
    // 处理输入框 输入事件
    handleInput(e) {
      this.iVal = e.target.value;
    },
    // 处理输入框 change事件
    handleChange(e) {
      const val = e.target.value === '' ? this.cVal : Number(e.target.value);
      this.setLastVal(val);
    },
  },
};