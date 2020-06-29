const template = `
  <div
  class="config-panel-wrapper"
  :style="{ width: showPanel ? '330px' : '0px' }"
  >
    <NavBar width="330px" :data="navList" v-model="nav" />
    <ConfigHeader v-bind="comInfo" />
    <StylePanel class="panel" v-if="nav.label === '样式'" />
    <DataPanel class="panel" v-if="nav.label === '数据'" />
    <InteractivePanel class="panel" v-if="nav.label === '交互'" />
    <Publish class="panel" v-if="nav.label === '发布'" />
  </div>
`;


import NavBar from '../components/NavBar.js';
import ConfigHeader from '../components/ConfigHeader.js';
import StylePanel from './StylePanel.js';
import DataPanel from './DataPanel.js';
import InteractivePanel from './InteractivePanel.js';
import Publish from './Publish.js';

const { mapState } = Vuex;

export default {
  name: 'developer',
  template,
  components: {
    NavBar,
    ConfigHeader,
    StylePanel,
    DataPanel,
    InteractivePanel,
    Publish,
  },
  data() {
    return {
      showPanel: true,
      navList: [
        {
          label: '样式',
        },
        {
          label: '数据',
        },
        {
          label: '交互',
        },
        {
          label: '发布',
        },
      ],
      nav: {
        label: '样式',
      },
    };
  },
  computed: {
    ...mapState(['name']),
    comInfo() {
      return { name: this.name, activeKey: this.activeKey };
    },
  },
};