
const template = `
    <div class="opt-group">
    <div
      class="group-title"
      :style="{
        color: value.hasOwnProperty('show')
          ? value.show
            ? ''
            : '#737c80'
          : '',
      }"
      @click="handleFold"
    >
      <span class="group-name">
        {{ config.name }}
      </span>
      <div
        class="action-wrapper"
        :style="{
          'justify-content': value.hasOwnProperty('show')
            ? 'space-between'
            : 'flex-end',
        }"
      >
        <OptBoolean
          v-if="value.hasOwnProperty('show')"
          :value="value.show"
          @click.native="handleShow"
        />
        <div :class="showFlag ? 'bottom-triangle' : 'right-triangle'"></div>
      </div>
    </div>
    <transition
      v-on:enter="enter"
      v-on:after-enter="afterEnter"
      v-on:leave="leave"
      v-on:after-leave="afterLeave"
    >
      <OptList
        v-if="showFlag"
        :config="config.children"
        :value="value"
        @change="handleChange"
        class="nothing"
      />
    </transition>
  </div>`


/**
 * @name 配置面板控件-组
 * @desc 配置对象类型的数据。
 * @param {Object} config 默认配置{show-是否显示本组内容 default-默认数据 ...}
 * @param {Object} value 传入值
 * @event change 更新父组件的传入值
 * @eg <OptGroup :config="config" :value="value" @change="change" />
 */
import optMixin from './js/mixins.js';

export default {
  mixins: [optMixin],
  template,
  props: {
    show: [String, Object],
  },
  data() {
    return {
      fold: this.config.open || false, // 是否折叠（如果config中有open字段且为true,则展开当前组）
    };
  },
  computed: {
    showFlag() {
      const { value, fold } = this;
      return value.hasOwnProperty('show') ? value.show && fold : fold;
    },
  },
  methods: {
    // 折叠/展开组
    handleFold() {
      this.fold = !this.fold;
    },
    // 是否显示本组内容
    handleShow() {
      if (this.value.hasOwnProperty('show')) {
        this.handleChange({
          show: !this.value.show,
        });
        if (!this.value.show) {
          this.fold = true;
        }
      }
    },
    // 监听组内容变化
    handleChange(draftState) {
      this.$emit('change', draftState);
    },
  },
};

