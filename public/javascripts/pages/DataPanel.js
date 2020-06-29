const template = `
  <div class="data-panel-wraper">
  <div v-if="JSON.stringify(source) !== '{}'">
    <div class="item" v-for="(item, key) in source" :key="key">
      <span>{{ item.description }}</span>
      <CodeEditor
        :height="500"
        :value="JSON.stringify(item.data)"
        @change="handleChange($event, key)"
      />
    </div>
  </div>
  <span v-else>该组件无需配置数据</span>
  </div>
`;
const { mapState, mapActions  } = Vuex;
import CodeEditor from '../components/CodeEditor.js';

export default {
  name: 'data-panel',
  template,
  components: {
    CodeEditor
  },
  computed: {
    ...mapState(["source"])
  },
  methods: {
    ...mapActions(["updateValue"]),
    handleChange(value, key) {
      this.updateValue({
        key: ["source", key],
        draftState: { data: JSON.parse(value) }
      });
    }
  }
};