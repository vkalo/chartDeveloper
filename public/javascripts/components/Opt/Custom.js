
/**
 * @name 自定义类型
 * @param {Function} render 自定义渲染内容
 * @eg <OptCustom :render="render"></FCustom>
 */
export default {
  name: 'Custom',
  functional: true,
  props: {
    render: Function,
  },
  render: (h, ctx) => {
    return ctx.data.attrs.config.render(h);
  },
};

