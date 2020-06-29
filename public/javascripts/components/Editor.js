const template = `
<div ref="container" class="monaco-editor" :style="\`height: \${height}px\`" />
`;

/**
 * @name 代码编辑器 - 简版。
 * @param {String} codes 初始代码
 * @param {String} language 编辑器语言类型
 * @param {Boolean} readOnly 是否只读
 * @param {Boolean} minimap 是否显示缩略图
 * @param {Number} current 用于区别多个编辑器切换
 * @param {Object} editorOptions 编辑器其他配置项
 * @param {String} height 编辑器高度
 * @event change 监听函数
 * @eg <BaseEditor
        :codes="value"
        :current="current"
        :readOnly="true"
        :minimap="false"
        language="javascript"
        @change="handleChange" />
 */

export default {
  name: 'BaseEditor',
  template,
  props: {
    codes: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'json',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    minimap: {
      type: Boolean,
      default: false,
    },
    current: Number,
    editorOptions: {
      type: Object,
      default: function() {
        return {
          selectOnLineNumbers: true, // 显示行号
          roundedSelection: false,
          cursorStyle: 'line', // 光标样式
          automaticLayout: false, // 自动布局
          glyphMargin: true, // 字形边缘
          useTabStops: false,
          fontSize: 28, // 字体大小
          autoIndent: true, // 自动布局
        };
      },
    },
    height: {
      type: Number,
      default: 138,
    },
  },
  data() {
    return {
      editor: null,
      theme: {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'custom-info', foreground: 'a3a7a9', background: 'ffffff' },
          { token: 'custom-error', foreground: 'ee4444' },
          { token: 'custom-notice', foreground: '1055af' },
          { token: 'custom-date', foreground: '20aa20' },
        ],
        colors: {
          'editor.background': '#191919',
        },
      },
    };
  },
  watch: {
    current() {
      if (this.editor) {
        this.editor.setValue(this.codes);
        this.format();
      }
    },
    codes(val) {
      if (this.editor) {
        this.editor.setValue(val);
        this.format();
      }
    },
  },
  mounted() {
    if (!this.editor) {
      this.$nextTick(() => {
        this.initEditor();
      });
    }
  },
  methods: {
    initEditor() {
      monaco.editor.defineTheme('myTheme', this.theme);
      this.editor = monaco.editor.create(this.$refs.container, {
        value: null,
        language: this.language,
        theme: 'myTheme', // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
        editorOptions: this.editorOptions,
        minimap: {
          enabled: this.minimap,
        },
        readOnly: this.readOnly,
        formatOnType: true,
        formatOnPaste: true,
        detectIndentation: true,
        autoIndent: true,
        tabSize: 2,
        indentSize: 2,
      });
      this.editor.onDidBlurEditorWidget(() => {
        if (this.editor) {
          const resCode = this.editor.getValue();
          if (this.language === 'json' && !this.isJSON(resCode)) {
            this.$message({
              type: 'error',
              message: '请输入正确的数据格式',
            });
          } else {
            this.$emit('change', resCode);
          }
        }
      });
      const res =
        this.language === 'json' && this.codes !== ''
          ? JSON.stringify(JSON.parse(this.codes), null, '\t')
          : this.codes;
      this.editor.setValue(res);
    },
    format() {
      this.editor.trigger(null, 'editor.action.formatDocument');
    },
    isJSON(str) {
      if (typeof str === 'string') {
        try {
          var obj = JSON.parse(str);
          if (typeof obj === 'object' && obj) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
    },
  },
  beforeDestroy() {
    if (this.editor) {
      if (this.editor.getModel()) {
        this.editor.getModel().dispose();
      }
      this.editor.dispose();
      this.editor = null;
    }
  },
};