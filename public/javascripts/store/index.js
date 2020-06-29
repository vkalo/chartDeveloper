import { getOptionsValue, load } from '../utils/index.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: null,
    options: null,
    defaultOptions: null,
    poster: null,
    source: null,
    type: null,
    view: null,
    ChartComponent: null,
    editor:false,
  },
  mutations: {
    /** 存储当前编辑页 screenId
     * @param screenId 编辑页id
     */
    setValue(state, { key, value }) {
      Vue.set(state, key, value);
    },
    updateValue(state, { key, draftState }) {
      key = Array.isArray(key) ? key : [key];
      const target = key.reduce((target, key) => target[key], state);
      Object.entries(draftState).forEach(([key, value]) => {
        Vue.set(target, key, value);
      });
    },
    initEditor(state,flag){
      state.editor=flag;
    }
  },
  actions: {
    async init({ commit }) {
      const [
        { chartConfig },
        { default: ChartComponent },
      ] = await Promise.all([
        load('globe_3d@0.0.1/package.json'),
        load('globe_3d@0.0.1/index.js'),
      ]);

      chartConfig.defaultOptions = getOptionsValue(
        _.cloneDeep(chartConfig.options),
      );
      Object.entries(chartConfig).forEach(([key, value]) => {
        commit('setValue', { key, value });
      });
      commit('setValue', { key: 'ChartComponent', value: ChartComponent });
    },
    updateValue({ commit }, { key, draftState }) {
      commit('updateValue', { key, draftState });
    },
  },
});