const template = `
<div class="publish-panel-wraper" v-if="!!view && !!options">
    <PageItem label="图表尺寸" class="view">
      <span>宽度</span>
      <OptNumber
        :value="view.width"
        :config="options.width"
        @change="handleChange('width', $event)"
      />
    </PageItem>
    <PageItem class="view">
      <span>高度</span>
      <OptNumber
        :value="view.height"
        :config="options.height"
        @change="handleChange('height', $event)"
      />
    </PageItem>
    <PageItem label="组件类型">
      <OptSelect
        :value="chartType"
        :config="chartTypeList"
        @change="selectChange('type', $event)"
      />
    </PageItem>
  </div>
`;
import PageItem from '../components/PageItem.js';

const {mapState, mapActions} = Vuex
export default {
  name: 'publish-panel',
  template,
  components: { PageItem },
  data() {
    return {
      options: {
        width: {
          type: 'Number',
          min: 0,
          max: 9999,
          step: 1,
          // label: '宽度',
          default: 60,
        },
        height: {
          type: 'Number',
          min: 0,
          max: 9999,
          step: 1,
          // label: '高度',
          default: 60,
        },
      },
      chartType: null,
      chartTypeList: {
        list: [],
      },
      version: null,
    };
  },
  computed: {
    ...mapState(['view']),
  },
  methods: {
    ...mapActions(['updateValue']),
    handleChange(key, value) {
      this.updateValue({
        key: 'view',
        draftState: { [key]: value },
      });
    },
    selectChange() {},
  },
};