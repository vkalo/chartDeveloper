const template = `
  <div class="base-nav-bar-wraper" :style="boxStyle">
  <span
    v-for="(item, index) in _data_"
    :key="index"
    :style="itemStyle"
    class="base-nav-bar-item fz16"
    :class="{ selected: _value_ === item[labelKey] }"
    @click="$emit('input', data[index])"
    >{{ item[labelKey] }}</span
  >
  </div>
`;
import {setPx} from '../utils/index.js';

export default {
  name: 'baseNavBar',
  template,
  data() {
    return {};
  },
  props: {
    value: {
      type: null,
    },
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    labelKey: {
      type: String,
      default: 'label',
    },
    fontSize: {
      type: [Number, String],
      default: 20,
    },
    height: {
      type: [Number, String],
      default: 50,
    },
    width: {
      type: [Number, String],
    },
  },
  computed: {
    _value_() {
      return typeof this.value === 'object' && this.value !== null
        ? this.value[this.labelKey]
        : this.value;
    },
    _data_() {
      const { labelKey } = this;
      return this.data.map((item) => {
        return typeof item === 'string' ? { [labelKey]: item } : item;
      });
    },
    boxStyle() {
      const style = { height: setPx(this.height) };
      this.width ? (style.width = setPx(this.width)) : null;
      return style;
    },
    itemStyle() {
      const style = {};
      return style;
    },
  },
};