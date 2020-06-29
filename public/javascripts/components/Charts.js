const template = `
  <div
    class="chart-wrapper"
    :style="{
      width: \`\${view ? view.width : 0}px\`,
      height: \`\${view ? view.height : 0}px\`
    }"
  >
    <div ref="domEle"></div>
  </div>
`;
import { getSource, getHandler } from "../utils/index.js";

const { mapState } = Vuex;
const { cloneDeep } = _;
export default {
  name: 'developer',
  template,
  data() {
    return {
      chart: null
    };
  },
  computed: {
    ...mapState(["ChartComponent", "source", "view", "defaultOptions"]),
    data() {
      return Object.entries(this.source).reduce((res, [key, source]) => {
        res[key] = source.data;
        return res;
      }, {});
    }
  },
  watch: {
    ChartComponent: {
      immedita: true,
      handler(val) {
        if (val) {
          this.initChart();
        }
      }
    },
    defaultOptions: {
      deep: true,
      handler(val) {
        if (typeof this.chart.updateOptions == "function") {
          this.chart.updateOptions(cloneDeep(val));
        }
      }
    },
    view: {
      deep: true,
      handler() {
        if (typeof this.chart.updateView == "function") {
          this.$nextTick(() => {
            this.chart.updateView();
          });
          return;
        }
      }
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const { ChartComponent } = this;
      this.chart = new ChartComponent(
        this.$refs.domEle,
        cloneDeep(this.defaultOptions)
      );
      this.chart.render(cloneDeep(getSource(this.data)));
      Object.entries(this.source).forEach(([key, source]) => {
        const unwatch = this.$watch(
          `source.${key}`,
          newData => {
            if (!this.chart) {
              return;
            }
            const handler = source.handle;
            const fun = getHandler(this.chart, handler);

            if (handler) {
              fun(newData.data);
            } else {
              fun(getSource(this.data));
            }
          },
          { deep: true }
        );
        this.$once("hook:destroyed", unwatch);
      });
    }
  }
};