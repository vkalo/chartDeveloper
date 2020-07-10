const template = `
<div class="publish-panel-wraper" v-if="!!view && !!options">
    <PageItem label="图表尺寸" class="view">
      <span>宽度</span>
      <OptNumber
        :value="view.width"
        :config="options.width"
        @change="handleChange('width', $event)"
      />
    </PageItem>
    <PageItem class="view">
      <span>高度</span>
      <OptNumber
        :value="view.height"
        :config="options.height"
        @change="handleChange('height', $event)"
      />
    </PageItem>
    <PageItem label="组件类型">
      <OptSelect
        :value="chartType"
        :config="chartTypeList"
        @change="selectChange('type', $event)"
      />
    </PageItem>
    <PageItem label="上传封面">
      <div class="poster">
        <span @click="upload">上传</span>
        <img :src='img' />
      </div>
    </PageItem>
  </div>
`;
import PageItem from '../components/PageItem.js';

const protocolReg = /^http(s)?:\/\//;
const { mapState, mapActions } = Vuex;
export default {
  name: 'publish-panel',
  template,
  components: { PageItem },
  data() {
    return {
      options: {
        width: {
          type: 'Number',
          min: 0,
          max: 9999,
          step: 1,
          // label: '宽度',
          default: 60,
        },
        height: {
          type: 'Number',
          min: 0,
          max: 9999,
          step: 1,
          // label: '高度',
          default: 60,
        },
      },
      chartType: null,
      chartTypeList: {
        list: [],
      },
      version: null,
    };
  },
  computed: {
    ...mapState(['view', 'poster']),
    img() {
      console.log(this.poster);
      const poster = this.poster;
      return protocolReg.test(poster) ? poster : opener(poster);
    },
  },
  methods: {
    ...mapActions(['updateValue']),
    handleChange(key, value) {
      this.updateValue({
        key: 'view',
        draftState: { [key]: value },
      });
    },
    selectChange() { },
    upload() {
      const input = document.createElement('input');
      input.type = "file";
      input.accept = "image/*";
      input.click();
      input.addEventListener('change', (e) => {
        const formData = new FormData();
        formData.append('poster', input.files[0]);
        console.log('发送')
        axios.post('/poster', formData).then(res => {
          this.$message({type:'info',message:'保存成功'});
          console.log(res);
        }).catch(()=>{
          this.$message({type:'error',message:'保存失败'});
        })
      })
    },
  },
};