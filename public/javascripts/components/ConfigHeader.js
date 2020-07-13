const template = `
  <div class="config-header-wrapper">
  <div class="title">
    <span class="name">{{ name }}</span>
  </div>
  <div
    class="button"
    v-if="activeKey !== 2"
    :class="{ active: activeKey === 3 }"
    @click="submit"
  >
    {{ activeKey === 3 ? "发布" : "保存" }}
  </div>
  </div>
`;

export default {
  name: 'config-header',
  template,
  data() {
    return {};
  },
  props: ["name", "verson", "activeKey"],
  methods: {
    submit() {
      axios.post("/save").then(({data})=>{
        if(data.status){
          this.$message({type:'info',message:'保存成功'});
        }else{
          this.$message({type:'error',message:'保存失败'});
        }

      }).catch(()=>{
        this.$message({type:'error',message:'保存失败'});
      });
    }
  }
};