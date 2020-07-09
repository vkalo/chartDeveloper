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
    // 父节点
    this.nodeList = {};
    this.parentNode = null;
    // 点击事件
    this.openHref = this.openHref.bind(this);
    // text
    this.text = '';
    //渐变色id
    this.gradientId = '';
  }

  /**
   * 图表初始化方法
   * @param {Array} data 数据
   */
  render(data) {
    if (!this.nodeList.svg) {
      // 创建svg
      const svg = this.createSvgDom('svg');
      Object.assign(svg.style, {
        width: '100%',
        height: '100%',
      });
      // 创建渐变色
      const linearGradient = this.createSvgDom('linearGradient');
      const gradientId = String(Math.random().toFixed(8)).substr(2);
      this.setAttribute(linearGradient, {
        id: gradientId,
        x1: '0.5',
        y1: '0',
        x2: '0.5',
        y2: '1',
      });
      // 创建文本
      const text = this.createSvgDom('text');

      Object.assign(text.style, { dominantBaseline: 'middle' });

      // 添加至父节点
      svg.appendChild(linearGradient);
      svg.appendChild(text);
      this.container.appendChild(svg);

      Object.assign(this.nodeList, { svg, linearGradient, text });
      Object.assign(this, { gradientId });
    }

    this.updateData(data);
    this.updateOptions(this.options);
  }
  /**
   * 更新options方法
   * @param {Object} options 更新的options
   */
  updateOptions(options) {
    if (options) {
      this.options = options;
      const { svg, linearGradient, text } = this.nodeList;
      const { align, linkConfig, textStyle, writingMode } = options;

      // 设置文字方向
      Object.assign(svg.style, { writingMode });

      // 设置渐变
      const { gradient } = textStyle;
      linearGradient.innerHTML = gradient.gradientColor.reduce((res, item) => {
        res += `<stop stop-color="${item.color}" offset="${item.offset *
          100}%" />`;
        return res;
      }, '');
      Object.assign(linearGradient.style, {
        gradientTransform: `rotate(${gradient.angle})`,
      });

      // 设置文字
      Object.assign(text.style, {
        fontSize: textStyle.fontSize + 'px',
        letterSpacing: textStyle.letterSpacing + 'px',
        fontWeight: textStyle.fontWeight,
        fontFamily: textStyle.fontFamily,
      });
      this.setAttribute(text, {
        fill: `${gradient.show ? `url(#${this.gradientId})` : textStyle.color}`,
      });
      switch (align) {
        case 'center': {
          this.setAttribute(text, { x: '50%', y: '50%' });
          Object.assign(text.style, { textAnchor: 'middle' });
          break;
        }
        case 'left': {
          writingMode === 'horizontal-tb'
            ? this.setAttribute(text, { x: '0%', y: '50%' })
            : this.setAttribute(text, { x: '50%', y: '0%' });
          Object.assign(text.style, { textAnchor: 'start' });
          break;
        }
        case 'right': {
          writingMode === 'horizontal-tb'
            ? this.setAttribute(text, { x: '100%', y: '50%' })
            : this.setAttribute(text, { x: '50%', y: '100%' });
          Object.assign(text.style, { textAnchor: 'end' });
          break;
        }
      }

      if (linkConfig.href) {
        svg.style.cursor = 'pointer';
        svg.addEventListener('click', this.openHref);
      } else {
        svg.style.cursor = 'initial';
        svg.removeEventListener('click', this.openHref);
      }
    }
  }

  /**
   * 更新data方法
   * @param {Array} data 更新的dat
   */
  updateData(data) {
    if (Array.isArray(data) && data[0]) {
      this.nodeList.text.innerHTML = data[0].value;
    }
  }

  /**
   * 更新图表View大小方法
   */
  updateView() {
  }

  //设置节点属性
  setAttribute(dom, object) {
    Object.entries(object).forEach(([key, value]) => {
      dom.setAttribute(key, value);
    });
  }

  // 创建svg元素
  createSvgDom(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }

  // 打开地址
  openHref() {
    const { href, newWindow = false } = this.options.linkConfig;
    newWindow ? window.open(href) : (window.location.href = href);
  }

  /**
   * 销毁组件方法
   */
  destroy() {
    if (this.nodeList.svg) {
      this.nodeList.svg.removeEventListener('click', this.openHref);
      this.nodeList && (this.nodeList = {});
    }
  }
}

export default Chart;
