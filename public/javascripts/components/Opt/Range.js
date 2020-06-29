
const template = `
  <div class="slider-wrapper">
    <input
      class="slider"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="sVal"
      :style="sliderStyle"
      @input="handleSlider"
    />
    <div class="text-item">
      <input
        type="number"
        :value="iVal"
        :min="min"
        :max="max"
        @input="handleInput"
        @change="handleChange"
      />
      <span v-if="label" class="unit">{{ label }}</span>
    </div>
  </div>`

/**
 * @name 配置面板控件-范围选择器
 * @desc 配置透明度、进度等比例类型的数据。
 * @param {Object} config 默认配置{max-最大值 min-最小值 step-步长 default-默认值}
 * @param {Number} value 传入值
 * @event change 更新父组件的传入值
 * @eg <OptRange :config="config" :value="value" @change="change" />
 */
import optMixin from './js/mixins.js';
export default {
  name: 'Range',
  mixins: [optMixin],
  template,
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      max: this.config.max || this.config.max === 0 ? this.config.max : 100, // 最大值
      min: this.config.min || this.config.min === 0 ? this.config.min : 0, // 最小值
      step: this.config.step || 1,
      userSlider: null, // 用户滑动的值
      iVal: null, // 用户输入的值
      cVal: 0, // 当前的值
      label: this.config.label || '', // 文字标签
    };
  },
  computed: {
    // 滑动条颜色
    sliderStyle() {
      const { sVal, max, min } = this;
      const percent = ((100 * (Number(sVal) - min)) / (max - min)).toFixed(2);
      return {
        background: `linear-gradient(to right, rgba(148, 91, 224, 1) ${percent}%, rgb(38, 42, 53) ${percent}%)`,
      };
    },
    // 滑动条值
    sVal() {
      return this.userSlider || this.cVal;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        const newVal = val === undefined ? val : Number(val);
        this.iVal = newVal;
        this.cVal = newVal;
        this.userSlider = null;
      },
    },
  },
  methods: {
    // 设置终值
    setLastVal(val) {
      if (this.cVal === val) {
        return;
      }
      this.userSlider = null;
      this.cVal = val;
      this.$emit('change', val);
    },
    // 处理滑动条 滑动事件
    handleSlider(e) {
      this.userSlider = e.target.value === '' ? 0 : Number(e.target.value);
      this.iVal = this.userSlider;
      this.setLastVal(this.userSlider);
    },
    // 处理输入框 输入事件
    handleInput(e) {
      const { min, max } = this;
      this.iVal = e.target.value;
      this.userSlider = (max - min) * this.iVal;
    },
    // 处理输入框 change事件
    handleChange(e) {
      const { min, max, cVal } = this;
      const val = e.target.value === '' ? cVal : Number(e.target.value);
      this.iVal = val < min ? min : val > max ? max : val;
      this.userSlider = (max - min) * this.iVal;
      this.setLastVal(this.iVal);
    },
  },
};

