const template = `
  <div class="color-picker-wrapper">
    <div class="result-wrapper" ref="colorPicker">
      <div class="color-view" :style="{ background: innerValue }" />
      <input :value="innerValue" @change="changeValue" maxlength="30" />
      <div class="color-picker" @click="openSketch" />
    </div>
    <Sketch
      v-if="showSketch"
      :style="{ top: top + 'px' }"
      :value="innerValue"
      @input="handleChange"
    />
  </div>
`;

/**
 * @name 配置面板控件-颜色选择器
 * @desc 配置颜色类型的数据。
 * @param {Object} config 默认配置{default-默认数据 ...}
 * @param {String} value 传入值
 * @event change 更新父组件的传入值
 * @eg <OptColor :config="config" :value="value" @change="change" />
 */
import optMixin from './js/mixins.js';
const {Sketch} = VueColor;

export default {
  name: 'Color',
  mixins: [optMixin],
  template,
  props: {
    value: String,
  },
  data() {
    return {
      innerValue: this.value, // 选择器内部色值
      showSketch: false, // 是否显示颜色选取下拉框
      top: 34, // 颜色选取下拉框上边距
    };
  },
  watch: {
    value(val) {
      this.innerValue = val;
    },
  },
  mounted() {
    window.addEventListener('click', this.handleSketch, true);
    window.addEventListener('resize', this.calcTop, true);
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('click', this.handleSketch, true);
      window.removeEventListener('resize', this.calcTop, true);
    });
  },
  methods: {
    // 监听选择变化
    handleChange(val) {
      const { r, g, b, a } = val.rgba;
      if (val.source === 'rgba') {
        this.innerValue = `rgba(${r}, ${g}, ${b}, ${a})`;
      } else {
        this.innerValue = `rgb(${r}, ${g}, ${b})`;
      }
      this.$emit('change', this.innerValue);
    },
    // 打开选择器
    openSketch() {
      this.showSketch = true;
      this.calcTop();
    },
    // 监听全局点击事件，决定是否关闭选择器
    handleSketch(e) {
      const arr = e.path.map((a) => a.className);
      if (arr.indexOf('vc-sketch') === -1) {
        this.showSketch = false;
      }
    },
    // 计算选择器的位置
    calcTop() {
      const { bottom } = this.$refs.colorPicker.getBoundingClientRect();
      const height = document.body.clientHeight;
      const inputH = 34; // 输入框的高度
      const sketchH = 286; // sketch选择器的高度 345
      // 计算选择器的位置
      if (this.showSketch) {
        this.top = height - bottom > sketchH ? inputH : -sketchH;
      } else {
        this.top = inputH;
      }
    },
    // 监听输入框改变
    changeValue(e) {
      const oldVal = this.innerValue;
      const newVal = e.target.value;
      // 十六进制Hex
      const reg1 = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/;
      // RGB
      const reg2 = /^rgb\((25[0-5]|2[0-4]\d|[0-1]?\d?\d),(\s)?(25[0-5]|2[0-4]\d|[0-1]?\d?\d),(\s)?(25[0-5]|2[0-4]\d|[0-1]?\d?\d)\)/i;
      // RGBA
      const reg3 = /^rgba\((25[0-5]|2[0-4]\d|[0-1]?\d?\d),(\s)?(25[0-5]|2[0-4]\d|[0-1]?\d?\d),(\s)?(25[0-5]|2[0-4]\d|[0-1]?\d?\d),(\s)?([0-1]|0\.\d)\)/i;
      const flag = reg1.test(newVal) || reg2.test(newVal) || reg3.test(newVal);
      this.innerValue = null;
      this.innerValue = flag ? newVal : oldVal;
      this.$emit('change', this.innerValue);
    },
  },
  components: { Sketch },
};