/**
 * 图表
 */
class Chart {
  /**
   * 
   * @param {Elment} container dom容器节点
   * @param {Object} options package.json 解析后options 
   */
  constructor(container, options) {
    this.container = container;
    this.options = options;
  }

  /**
   * 图表初始化方法
   * @param {Array} data 数据
   */
  render(data) {
    this.chart = null;
  }
  /**
   * 更新options方法
   * @param {Object} options 更新的options
   */
  updateOptions(options) {
  }

  /**
   * 更新data方法
   * @param {Array} data 更新的dat
   */
  updateData(data) {
    if (data && data.linesData && data.scatterData) {
      this.linesData = data.linesData;
      this.scatterData = data.scatterData;
      this.updateOptions(this.options);
    }
  }

  /**
   * 更新图表View大小方法
   */
  updateView() {
  }

  /**
   * 销毁组件方法
   */
  destroy() {
    if (this.chart) {
      this.chart = null;
    }
  }
}

export default Chart;
