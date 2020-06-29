const template = `
  <div class="opt-array">
    <div class="array-title" @click="toggleVisible">
      {{ config.name }}
      <span class="tool">
        <span>
          <span
            v-if="fold && !config.hasOwnProperty('action')"
            class="i-style"
            @click.stop="addDataItem"
          >
            <BaseIcon icon="attribute_icon_add" size="12" />
          </span>
          <span
            v-if="fold && !config.hasOwnProperty('action')"
            class="i-style"
            @click.stop="delDataItem"
          >
            <BaseIcon icon="tab_icon_trash" size="12" />
          </span>
        </span>
        <div :class="fold ? 'bottom-triangle' : 'right-triangle'"></div>
      </span>
    </div>
    <transition
      v-on:enter="enter"
      v-on:after-enter="afterEnter"
      v-on:leave="leave"
      v-on:after-leave="afterLeave"
    >
      <div v-show="fold" class="array-container">
        <div class="series-tab">
          <span class="i-style arrow" @click="moveTo('left')">&lt;</span>
          <div class="tab-item-wrapper" ref="tabOuter">
            <div class="inner" ref="tabInner">
              <div
                v-for="(item, index) in value"
                :class="
                  index === selectedIndex ? 'tab-item checked' : 'tab-item'
                "
                :key="config.seriesName + index"
                @click="handleSelect(index)"
              >
                <a target="_blank">{{ config.seriesName + (index + 1) }}</a>
              </div>
            </div>
          </div>
          <span class="i-style arrow" @click="moveTo('right')">&gt;</span>
        </div>
        <OptList
          v-if="value[selectedIndex]"
          :config="config.options"
          :value="value[selectedIndex]"
          @change="handleChange"
          class="nothing"
        />
      </div>
    </transition>
  </div>
`

/**
 * @name 配置面板控件-系列/数组
 * @desc 配置数组类型的数据。
 * @param {Object} config 默认配置{seriesName-系列项名称 default-默认数据 ...}
 * @param {Array} value 传入值
 * @event change 更新父组件的传入值
 * @eg <OptArray :config="config" :value="value" @change="change" />
 */
import optMixin from './js/mixins.js';

function parseDefaultValue(configs) {
  return Object.entries(configs).reduce((pre, [key, config]) => {
    if (config.type === 'array') {
      pre[key] = parseDefaultValue(config.child);
    } else if (config.type === 'group') {
      pre[key] = parseDefaultValue(config.children);
      if (config.hasOwnProperty('show')) {
        pre[key].show = config.show;
      }
    } else {
      pre[key] = config.default;
    }
    return pre;
  }, {});
}

export default {
  template,
  mixins: [optMixin],
  props: {
    value: Array,
  },
  data() {
    return {
      fold: false, // 是否折叠
      selectedIndex: Math.min(0, this.value.length - 1), // 当前选择的系列
      navOffset: 0, // nav偏移量
    };
  },
  computed: {
    // nav容器的宽度
    containerW() {
      return this.fold ? this.$refs.tabOuter.getBoundingClientRect().width : 0;
    },
  },
  updated() {
    this.updataNav();
  },
  methods: {
    // 折叠/展开系列
    toggleVisible() {
      this.fold = !this.fold;
    },
    // 监听系列选择
    handleSelect(i) {
      this.selectedIndex = i;
    },
    // 监听系列内容
    handleChange(draftState) {
      this.$emit('change', {
        [this.selectedIndex]: draftState,
      });
    },
    // 添加系列
    addDataItem() {
      const newData = parseDefaultValue(this.config.options);
      this.$emit('change', [...this.value, newData]);
      this.$nextTick(() => {
        this.selectedIndex = this.value.length - 1;
        this.moveToTheEnd();
      });
    },
    // 删除系列
    delDataItem() {
      const newValue = [...this.value];
      if (newValue.length <= 1) {
        this.$message({ type: 'warning', message: '请至少保留一项' });
        return;
      }
      newValue.splice(this.selectedIndex, 1);
      this.selectedIndex = Math.min(this.selectedIndex, newValue.length - 1);
      this.$emit('change', newValue);
    },
    // 系列导航左右滑动
    moveTo(direction) {
      const { containerW } = this;
      const currentOffset = this.navOffset;
      const navW = this.$refs.tabInner.offsetWidth;

      if (direction === 'right') {
        if (navW - currentOffset <= containerW) {
          return;
        }
        this.navOffset =
          navW - currentOffset > containerW * 2
            ? currentOffset + containerW
            : navW - containerW;
      } else {
        if (!currentOffset) {
          return;
        }
        this.navOffset =
          currentOffset > containerW ? currentOffset - containerW : 0;
      }
      this.$refs.tabInner.style.transform = `translateX(${-this.navOffset}px)`;
    },
    // 系列导航移至最后
    moveToTheEnd() {
      const { containerW } = this;
      const navW = this.$refs.tabInner.offsetWidth;
      if (navW > containerW) {
        this.navOffset = navW - containerW;
        this.$refs.tabInner.style.transform = `translateX(${-this
          .navOffset}px)`;
      }
    },
    // 更新系列导航
    updataNav() {
      const { containerW } = this;
      const navW = this.$refs.tabInner.offsetWidth;
      const currentOffset = this.navOffset;

      if (containerW < navW) {
        if (navW - currentOffset < containerW) {
          this.navOffset = navW - containerW;
        }
      } else {
        if (currentOffset > 0) {
          this.navOffset = 0;
        }
      }
      this.$refs.tabInner.style.transform = `translateX(${-this.navOffset}px)`;
    },
  },
};
