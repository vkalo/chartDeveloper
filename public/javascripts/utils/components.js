
import BaseMessage from '../components/message.js';

//message 组件
let messageBox = null;
const messageList = [];
const maxMessage = 5;

function createMessageBox() {
  const div = document.createElement('div');
  Object.assign(div.style, {
    width: '580px',
    position: 'fixed',
    top: '118px',
    left: '0px',
    right: '0px',
    margin: '0 auto',
    zIndex: '999',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  });
  return div;
}

export function message(param) {
  let type = 'info';
  let message = '';
  let timeout = 200000;

  if (typeof param === 'string') {
    message = param;
  } else if (param.message) {
    type = param.type || type;
    message = param.message || message;
    timeout = param.timeout || timeout;
  } else {
    return null;
  }

  const Message = Vue.extend({ ...BaseMessage });
  let components = new Message({ propsData: { type, message } });

  let el = components.$mount().$el;

  messageBox.appendChild(el);
  const close = () => {
    if (el) {
      messageBox.removeChild(el);
      el = null;

      const index = messageList.findIndex((item) => item === close);
      messageList.splice(index, 1);
    }
  };
  components.$on('close', close);
  setTimeout(close, timeout);
  messageList.push(close);
  if (messageList.length > maxMessage) {
    messageList[0]();
  }
  components = null;
}

export default {
  install(Vue) {
    messageBox = createMessageBox();
    document.body.appendChild(messageBox);
    Vue.prototype.$message = message;
  },
};
