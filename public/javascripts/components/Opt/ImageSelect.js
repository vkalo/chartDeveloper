const template = `
  <div class="select-wrapper" ref="selector">
    <div
      :class="\`result-wrapper \${visible ? 'is-open' : ''}\`"
      @click="visible = !visible"
    >
      <div class="review">
        <div class="img" :style="{ backgroundImage: \`url(\${value})\` }"></div>
        <div class="text">{{ label }}</div>
      </div>
      <div class="selector">
        <div class="bottom-triangle"></div>
      </div>
    </div>
    <div
      v-if="visible"
      class="options"
      ref="selectOptions"
      :style="{ top: top + 'px' }"
    >
      <div v-if="config.list.length > 0" class="opt-box">
        <div
          v-for="(item, index) in config.list"
          :key="index"
          :class="item.value === innerValue ? 'opt-item checked' : 'opt-item'"
          @click="handleClick(item.value)"
        >
          <div class="img-box">
            <div
              class="img"
              :style="{ backgroundImage: \`url(\${item.value})\` }"
            />
          </div>
          <div class="text">{{ item.label }}</div>
        </div>
      </div>
      <div v-else class="no-data">暂无数据</div>
    </div>
  </div>
`

/**
 * @name 配置面板控件-下拉选择器
 * @param {Object} config 默认配置{default-默认值 list-选项}
 * @param {String, Number} value 传入值
 * @event change 更新父组件的传入值
 * @eg <OptImageSelect :config="config" :value="value" @change="change" />
 */
import optMixin from './js/mixins.js';
export default {
  name: 'ImageSelect',
  mixins: [optMixin],
  template,
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
  },
  computed: {
    label() {
      const { list } = this.config;
      const res = list.filter((ele) => ele.value === this.innerValue);
      return res.length > 0 ? res[0].label : '';
    },
  },
  data() {
    return {
      innerValue: this.value,
      visible: false,
      top: 68,
    };
  },
  watch: {
    value(val) {
      this.innerValue = val;
    },
  },
  mounted() {
    window.document.addEventListener('click', this.closeOption);
    window.addEventListener('resize', this.calcTop, true);
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('click', this.closeOption);
      window.removeEventListener('resize', this.calcTop, true);
    });
  },
  methods: {
    // 计算下拉框的位置
    calcTop() {
      this.$nextTick(() => {
        if (this.$refs.selectOptions) {
          const { bottom } = this.$refs.selector.getBoundingClientRect();
          const height = document.body.clientHeight;
          const optionsHeight = this.$refs.selectOptions.offsetHeight;
          this.top = height - bottom > optionsHeight ? 68 : -optionsHeight - 5;
        }
      });
    },
    // 监听点击事件
    handleClick(val) {
      this.$emit('input', val);
      this.$emit('change', val);
      this.visible = false;
    },
    // 关闭选项
    closeOption(e) {
      if (this.$refs.selector && !this.$refs.selector.contains(e.target)) {
        this.visible = false;
      }
    },
  },
};
