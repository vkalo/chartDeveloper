const template = `<div class="upload-wrapper">
    <div
      class="img-preview"
      :style="{ backgroundImage: \`url(\${url})\` }"
      @mouseenter="showBtn = true"
      @mouseleave="showBtn = false"
    >
      <div class="upload-area" v-if="showBtn || this.value === ''">
        选择图像
        <input
          class="upload-btn"
          type="file"
          accept="image/jpg, image/png, image/jpeg, image/gif"
          @change="uploadImage"
        />
      </div>
      <BaseIcon
        v-if="value"
        class="close"
        icon="tab_icon_trash"
        size="12"
        @click="resetImage"
      />
    </div>
    <div class="tips">{{ tips }}</div>
  </div>`

/**
 * @name 配置面板控件-图片选择器
 * @desc 配置图片类型的数据。
 * @param {Object} config 默认配置{default-默认数据 ...}
 * @param {String} value 传入值
 * @event change 更新父组件的传入值
 * @eg <OptImage :config="config" :value="value" @change="change" />
 */
import optMixin from './js/mixins.js';

export default {
  name: 'Upload',
  mixins: [optMixin],
  template,
  props: {
    value: String,
  },
  data() {
    return {
      tips: '请上传2M以内的JPG、PNG、GIF图片',
      showBtn: false,
      defaultUrl: require('../../../../assets/images/blank_bg.png'),
    };
  },
  computed: {
    url() {
      return this.value || this.defaultUrl;
    },
  },
  methods: {
    // 上传图片
    uploadImage(e) {
      const fileObj = e.target.files[0];
      if (!fileObj) {
        return;
      }
    },
    // 重置图片
    resetImage() {
      this.$emit('change', '');
    },
  },
};

