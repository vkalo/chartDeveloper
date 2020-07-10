const template = `
  <div class="base-message-wraper" :class="{ [type]: type }">
    <span>{{ message }}</span>
  </div>
`;

export default {
  name: 'baseMessage',
  template,
  props: {
    type: {
      type: String,
      default: 'info',
    },
    message: {
      type: String,
    },
  },
  computed: {
    i() {
      switch (this.type) {
        case 'info':
          return {
            icon: 'naza_tips_icon_warning',
            color: 'rgba(255,255,255,0.9)',
          };
        case 'success':
          return {
            icon: 'naza_tips_icon_success',
            color: 'rgba(255,255,255,0.9)',
          };
        case 'warning':
          return {
            icon: 'naza_tips_icon_warning',
            color: 'rgba(255,255,255,0.9)',
          };
        case 'error':
          return {
            icon: 'naza_tips_icon_error',
            color: 'rgba(255,255,255,0.9)',
          };
        default:
          return {
            icon: 'naza_tips_icon_warning',
            color: '#9C3BE8',
          };
      }
    },
  },
};