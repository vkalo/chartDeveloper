const template = `
  <div class="style-panel-wraper">
    <OptList :config="options" :value="defaultOptions" @change="handleChange" />
  </div>
`

const { mapState, mapActions  } = Vuex;

export default {
  name: 'style-panel',
  template,
  computed: {
    ...mapState(['defaultOptions', 'options']),
  },
  methods: {
    ...mapActions(['updateValue']),
    handleChange(draftState) {
      const key = Object.keys(draftState)[0];
      const newConfig = {};
      newConfig[key] = _.cloneDeep(this.defaultOptions[key]);
      this.deepMerge(draftState, newConfig);
      this.updateValue({ key: 'defaultOptions', draftState: newConfig });
    },
    // 深度合并
    deepMerge(from, to) {
      Object.entries(from).forEach(([key, value]) => {
        if (!Array.isArray(value) && typeof value === 'object') {
          this.deepMerge(value, to[key]);
        } else {
          to[key] = value;
        }
      });
    },
  },
};
