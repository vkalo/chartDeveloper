
const template = `<div class="opt-list">
    <div class="opt-item" v-for="(itemConfig, key) in config" :key="key">
      <OptGroup
        v-if="itemConfig.type === 'group' && handleShow(itemConfig, value)"
        :config="itemConfig"
        :value="value[key]"
        @change="(value) => handleChange({ [key]: value })"
      />
      <OptArray
        v-else-if="itemConfig.type === 'array' && handleShow(itemConfig, value)"
        :config="itemConfig"
        :value="value[key]"
        @change="(value) => handleChange({ [key]: value })"
      />
      <div
        class="other"
        v-else-if="handleShow(itemConfig, value) && itemConfig.show !== false"
      >
        <div class="opt-name" :title="itemConfig.name">
          {{ itemConfig.name }}
          <span v-if="itemConfig.description">
            <BaseTooltip
              class="tips"
              :content="'说明：' + itemConfig.description"
            >
              <BaseIcon icon="home_icon_help" size="14" />
            </BaseTooltip>
          </span>
        </div>
        <div class="opt-field">
          <component
            :is="mapTypeToCom[itemConfig.type] || mapTypeToCom.default"
            :config="itemConfig"
            :value="value[key]"
            @change="(value) => handleChange({ [key]: value })"
          />
        </div>
      </div>
    </div>
  </div>`

/**
 * @name 配置面板控件-配置项集合
 * @desc 配置一组多类型的数据。
 * @param {Object} config 默认配置
 * @param {Object} value 传入值
 * @event change 更新父组件的传入值
 * @eg <OptList :config="config" :value="value" @change="change" />
 */
import optMixin, { mapTypeToCom } from './js/mixins.js';
export default {
  mixins: [optMixin],
  template,
  data() {
    return {
      mapTypeToCom,
    };
  },
  methods: {
    handleChange(draftState) {
      this.$emit('change', draftState);
    },
    handleShow(itemConfig, value) {
      if (typeof itemConfig.belong === 'undefined') {
        return true;
      }
      const val = value[itemConfig.belong[0]];
      const vals = itemConfig.belong[1];
      if (
        typeof vals === 'string' ||
        typeof vals === 'boolean' ||
        typeof vals === 'number'
      ) {
        return val === vals;
      } else if (typeof vals === 'object' && vals.length > 0) {
        return vals.indexOf(val) > -1;
      } else {
        return false;
      }
    },
  },
};
