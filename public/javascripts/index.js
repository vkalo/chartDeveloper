import Preview from './pages/preview.js';
import ConfigPanel from './pages/configPanel.js';
import store from './store/index.js';
import './components/Opt/js/register.js';
import './utils/webSocket.js';
import components from './utils/components.js';

require.config({ paths: { 'vs': '/javascripts/lib/monaco-editor/min/vs' }});
require(['vs/editor/editor.main'], function() {
  store.commit('initEditor',true);
});
opener.baseUrl ='chart/';
const { mapActions } = Vuex;
const template = `
  <div class="developer-wrapper">
    <Preview />
    <ConfigPanel/>
  </div>
`

Vue.use(components);


var app = new Vue({
  el: '#app',
  components: {
    Preview,
    ConfigPanel,
  },
  mounted() {
    this.init();
  },
  template,
  store,
  methods: {
    ...mapActions(["init"])
  }
})
