const template = `
  <div class="preview-wrapper">
    <div class="view">
     <Chart v-if="ChartComponent"/>
    </div>
    <div class="tool-bar"></div>
  </div>
`;
import Chart from '../components/Charts.js';
const { mapState } = Vuex;

export default {
  name: 'developer',
  template,
  components: {
    Chart,
  },
  computed: {
    ...mapState(['ChartComponent']),
  },
};