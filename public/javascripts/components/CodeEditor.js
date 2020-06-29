const template = `
  <div class="code-wrapper">
    <Editor
      v-if="editor"
      :codes="codes"
      :current="current"
      :readOnly="readOnly"
      :language="language"
      :height="height"
      @change="handleChange"
    />
  </div>
`;

/**
 * @name 代码编辑器
 * @desc 附加复制和放大功能
 * @param {String} value 初始代码
 * @param {String} language 编辑器语言类型
 * @param {Boolean} readOnly 是否只读
 * @param {Boolean} minimap 是否显示缩略图
 * @param {Object} editorOptions 编辑器其他配置项
 * @param {String} height 编辑器高度
 * @event change 监听函数
 * eg: <BaseCodeEditor
        :value="code"
        :readOnly="true"
        :minimap="false"
        language="json"
        :height="600"
        @change="handleChange" />
 */

import Editor from './Editor.js';
const { mapState } = Vuex;

export default {
  name: 'codeEditor',
  template,
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      required: false,
    },
    readOnly: {
      type: Boolean,
    },
    minimap: {
      type: Boolean,
    },
    language: {
      type: String,
    },
    editorOptions: {
      type: Object,
    },
    height: {
      type: Number,
    },
  },
  data() {
    return {
      visiable: false,
      current: 0,
      codes: this.value,
    };
  },
  watch: {
    value(val) {
      this.codes = val;
    },
    visiable(val) {
      this.current = Number(val);
    },
  },
  methods: {
    handleCopy() {
      const text = document.createElement('textarea');
      text.innerHTML = this.codes;
      document.body.appendChild(text);
      text.select();
      document.execCommand('Copy');
      this.$message({ type: 'success', message: '复制成功' });
    },
    handleChange(msg) {
      this.codes = msg;
      this.$emit('change', msg);
    },
  },
  computed: {
    ...mapState(['editor']),
  },
};