const template = `
  <div class="config-item">
  <div class="item-label">{{ label }}</div>
  <div class="item-content">
    <slot></slot>
  </div>
  </div>
`;

export default {
  name: 'PageItem',
  template,
  props: {
    label: String,
  },
};